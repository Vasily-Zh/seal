// Store для управления шаблонами и категориями (с поддержкой API)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  TemplateCategory, 
  StampTemplate, 
  GeneratorBaseTemplate,
  IconWithTags 
} from '../types/templates';
import { allIcons } from '../data/allIcons';
import { 
  categoriesApi, 
  templatesApi, 
  setAdminToken, 
  clearAdminToken, 
  hasAdminToken,
  type ApiCategory,
  type ApiTemplate 
} from '../utils/api';

// Генерация уникального ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Конвертация API категории во внутренний формат
const apiCategoryToInternal = (cat: ApiCategory): TemplateCategory => ({
  id: cat.id,
  name: cat.name,
  order: cat.sort_order,
  isBuiltIn: false,
});

// Конвертация API шаблона во внутренний формат
const apiTemplateToInternal = (tpl: ApiTemplate): StampTemplate => ({
  id: tpl.id,
  name: tpl.name,
  categoryId: tpl.category_id,
  elements: tpl.elements,
  canvasSize: tpl.canvas_size,
  thumbnail: tpl.thumbnail || undefined,
  createdAt: tpl.created_at,
  isBuiltIn: false,
});

interface TemplatesState {
  // Данные
  categories: TemplateCategory[];
  templates: StampTemplate[];
  generatorTemplates: GeneratorBaseTemplate[];
  iconTags: Record<string, string[]>;
  
  // Состояние загрузки
  isLoading: boolean;
  isApiAvailable: boolean;
  lastError: string | null;
  
  // Загрузка данных с сервера
  loadFromServer: () => Promise<void>;
  
  // Категории
  addCategory: (category: Omit<TemplateCategory, 'id' | 'isBuiltIn'>) => Promise<string>;
  updateCategory: (id: string, updates: Partial<TemplateCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<boolean>;
  reorderCategories: (ids: string[]) => void;
  getAllCategories: () => TemplateCategory[];
  
  // Шаблоны
  addTemplate: (template: Omit<StampTemplate, 'id' | 'isBuiltIn' | 'createdAt'>) => Promise<string>;
  updateTemplate: (id: string, updates: Partial<StampTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<boolean>;
  getTemplatesByCategory: (categoryId: string) => StampTemplate[];
  getAllTemplates: () => StampTemplate[];
  
  // Генератор (локальный, без API)
  addGeneratorTemplate: (template: Omit<GeneratorBaseTemplate, 'id' | 'isBuiltIn' | 'createdAt'>) => string;
  updateGeneratorTemplate: (id: string, updates: Partial<GeneratorBaseTemplate>) => void;
  deleteGeneratorTemplate: (id: string) => boolean;
  getGeneratorTemplates: () => GeneratorBaseTemplate[];
  
  // Теги иконок
  setIconTags: (iconName: string, tags: string[]) => void;
  getIconTags: (iconName: string) => string[];
  searchIconsByTag: (query: string) => IconWithTags[];
  
  // Авторизация
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  
  // Инициализация
  initializeBuiltInData: () => void;
}

export const useTemplatesStore = create<TemplatesState>()(
  persist(
    (set, get) => ({
      categories: [],
      templates: [],
      generatorTemplates: [],
      iconTags: {},
      isLoading: false,
      isApiAvailable: true,
      lastError: null,
      
      // ==================== ЗАГРУЗКА С СЕРВЕРА ====================
      
      loadFromServer: async () => {
        set({ isLoading: true, lastError: null });
        
        try {
          // Загружаем категории
          const apiCategories = await categoriesApi.getAll();
          const categories = apiCategories.map(apiCategoryToInternal);
          
          // Загружаем шаблоны
          const apiTemplates = await templatesApi.getAll();
          const templates = apiTemplates.map(apiTemplateToInternal);
          
          set({ 
            categories, 
            templates, 
            isLoading: false,
            isApiAvailable: true,
          });
        } catch (error) {
          console.error('Failed to load from server:', error);
          set({ 
            isLoading: false, 
            isApiAvailable: false,
            lastError: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      },
      
      // ==================== КАТЕГОРИИ ====================
      
      addCategory: async (categoryData) => {
        const id = generateId();
        
        try {
          const result = await categoriesApi.create({
            name: categoryData.name,
            sort_order: categoryData.order,
          });
          
          const category: TemplateCategory = {
            id: result.id,
            name: categoryData.name,
            order: categoryData.order,
            isBuiltIn: false,
          };
          
          set((state) => ({
            categories: [...state.categories, category],
          }));
          
          return result.id;
        } catch (error) {
          console.error('Failed to add category:', error);
          throw error;
        }
      },
      
      updateCategory: async (id, updates) => {
        try {
          await categoriesApi.update(id, {
            name: updates.name,
            sort_order: updates.order,
          });
          
          set((state) => ({
            categories: state.categories.map((cat) =>
              cat.id === id ? { ...cat, ...updates } : cat
            ),
          }));
        } catch (error) {
          console.error('Failed to update category:', error);
          throw error;
        }
      },
      
      deleteCategory: async (id) => {
        try {
          await categoriesApi.delete(id);
          
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
            templates: state.templates.filter((t) => t.categoryId !== id),
          }));
          
          return true;
        } catch (error) {
          console.error('Failed to delete category:', error);
          return false;
        }
      },
      
      reorderCategories: (ids) => {
        set((state) => {
          const categoryMap = new Map(state.categories.map((c) => [c.id, c]));
          const reordered = ids
            .map((id, index) => {
              const cat = categoryMap.get(id);
              return cat ? { ...cat, order: index } : null;
            })
            .filter(Boolean) as TemplateCategory[];
          return { categories: reordered };
        });
      },
      
      getAllCategories: () => {
        const state = get();
        return [...state.categories].sort((a, b) => a.order - b.order);
      },
      
      // ==================== ШАБЛОНЫ ====================
      
      addTemplate: async (templateData) => {
        try {
          const result = await templatesApi.create({
            name: templateData.name,
            category_id: templateData.categoryId,
            elements: templateData.elements,
            canvas_size: templateData.canvasSize,
            thumbnail: templateData.thumbnail,
          });
          
          const template: StampTemplate = {
            id: result.id,
            name: templateData.name,
            categoryId: templateData.categoryId,
            elements: templateData.elements,
            canvasSize: templateData.canvasSize,
            thumbnail: templateData.thumbnail,
            createdAt: new Date().toISOString(),
            isBuiltIn: false,
          };
          
          set((state) => ({
            templates: [...state.templates, template],
          }));
          
          return result.id;
        } catch (error) {
          console.error('Failed to add template:', error);
          throw error;
        }
      },
      
      updateTemplate: async (id, updates) => {
        try {
          await templatesApi.update(id, {
            name: updates.name,
            category_id: updates.categoryId,
            elements: updates.elements,
            canvas_size: updates.canvasSize,
            thumbnail: updates.thumbnail,
          });
          
          set((state) => ({
            templates: state.templates.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
          }));
        } catch (error) {
          console.error('Failed to update template:', error);
          throw error;
        }
      },
      
      deleteTemplate: async (id) => {
        try {
          await templatesApi.delete(id);
          
          set((state) => ({
            templates: state.templates.filter((t) => t.id !== id),
          }));
          
          return true;
        } catch (error) {
          console.error('Failed to delete template:', error);
          return false;
        }
      },
      
      getTemplatesByCategory: (categoryId) => {
        return get().templates.filter((t) => t.categoryId === categoryId);
      },
      
      getAllTemplates: () => {
        return get().templates;
      },
      
      // ==================== ГЕНЕРАТОР (локальный) ====================
      
      addGeneratorTemplate: (templateData) => {
        const id = generateId();
        const template: GeneratorBaseTemplate = {
          ...templateData,
          id,
          isBuiltIn: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          generatorTemplates: [...state.generatorTemplates, template],
        }));
        return id;
      },
      
      updateGeneratorTemplate: (id, updates) => {
        set((state) => ({
          generatorTemplates: state.generatorTemplates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },
      
      deleteGeneratorTemplate: (id) => {
        const template = get().generatorTemplates.find((t) => t.id === id);
        if (!template || template.isBuiltIn) return false;
        
        set((state) => ({
          generatorTemplates: state.generatorTemplates.filter((t) => t.id !== id),
        }));
        return true;
      },
      
      getGeneratorTemplates: () => {
        return get().generatorTemplates;
      },
      
      // ==================== ТЕГИ ИКОНОК ====================
      
      setIconTags: (iconName, tags) => {
        set((state) => ({
          iconTags: {
            ...state.iconTags,
            [iconName]: tags,
          },
        }));
      },
      
      getIconTags: (iconName) => {
        return get().iconTags[iconName] || [];
      },
      
      searchIconsByTag: (query) => {
        if (!query.trim()) return [];
        
        const normalizedQuery = query.toLowerCase().trim();
        const state = get();
        const results: IconWithTags[] = [];
        
        for (const icon of allIcons) {
          const tags = state.iconTags[icon.name] || [];
          const displayName = icon.displayName.toLowerCase();
          
          const matchesTags = tags.some(tag => 
            tag.toLowerCase().includes(normalizedQuery)
          );
          const matchesName = displayName.includes(normalizedQuery);
          
          if (matchesTags || matchesName) {
            results.push({
              name: icon.name,
              source: icon.source,
              displayName: icon.displayName,
              tags,
            });
          }
        }
        
        return results;
      },
      
      // ==================== АВТОРИЗАЦИЯ ====================
      
      login: async (password) => {
        setAdminToken(password);
        // Пробуем загрузить данные с сервера для проверки
        try {
          await get().loadFromServer();
          return true;
        } catch {
          clearAdminToken();
          return false;
        }
      },
      
      logout: () => {
        clearAdminToken();
      },
      
      isAdmin: () => {
        return hasAdminToken();
      },
      
      // ==================== ИНИЦИАЛИЗАЦИЯ ====================
      
      initializeBuiltInData: () => {
        // Загружаем данные с сервера при инициализации
        get().loadFromServer();
      },
    }),
    {
      name: 'stamp-templates-storage',
      partialize: (state) => ({
        // Сохраняем локально только генератор и теги
        generatorTemplates: state.generatorTemplates,
        iconTags: state.iconTags,
      }),
    }
  )
);
