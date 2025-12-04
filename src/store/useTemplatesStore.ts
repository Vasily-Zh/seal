// Store для управления шаблонами и категориями

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  TemplateCategory, 
  StampTemplate, 
  GeneratorBaseTemplate,
  IconWithTags 
} from '../types/templates';
import { BUILT_IN_CATEGORIES } from '../types/templates';
import { allIcons } from '../data/allIcons';

// Генерация уникального ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface TemplatesState {
  // Данные
  categories: TemplateCategory[];
  templates: StampTemplate[];
  generatorTemplates: GeneratorBaseTemplate[];
  iconTags: Record<string, string[]>; // name -> tags[]
  
  // Категории
  addCategory: (category: Omit<TemplateCategory, 'id' | 'isBuiltIn'>) => string;
  updateCategory: (id: string, updates: Partial<TemplateCategory>) => void;
  deleteCategory: (id: string) => boolean;
  reorderCategories: (ids: string[]) => void;
  getAllCategories: () => TemplateCategory[];
  
  // Шаблоны
  addTemplate: (template: Omit<StampTemplate, 'id' | 'isBuiltIn' | 'createdAt'>) => string;
  updateTemplate: (id: string, updates: Partial<StampTemplate>) => void;
  deleteTemplate: (id: string) => boolean;
  getTemplatesByCategory: (categoryId: string) => StampTemplate[];
  getAllTemplates: () => StampTemplate[];
  
  // Генератор
  addGeneratorTemplate: (template: Omit<GeneratorBaseTemplate, 'id' | 'isBuiltIn' | 'createdAt'>) => string;
  updateGeneratorTemplate: (id: string, updates: Partial<GeneratorBaseTemplate>) => void;
  deleteGeneratorTemplate: (id: string) => boolean;
  getGeneratorTemplates: () => GeneratorBaseTemplate[];
  
  // Теги иконок
  setIconTags: (iconName: string, tags: string[]) => void;
  getIconTags: (iconName: string) => string[];
  searchIconsByTag: (query: string) => IconWithTags[];
  
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
      
      // ==================== КАТЕГОРИИ ====================
      
      addCategory: (categoryData) => {
        const id = generateId();
        const category: TemplateCategory = {
          ...categoryData,
          id,
          isBuiltIn: false,
        };
        set((state) => ({
          categories: [...state.categories, category],
        }));
        return id;
      },
      
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        }));
      },
      
      deleteCategory: (id) => {
        const category = get().categories.find((c) => c.id === id);
        if (!category || category.isBuiltIn) return false;
        
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          // Также удаляем шаблоны этой категории
          templates: state.templates.filter((t) => t.categoryId !== id),
        }));
        return true;
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
        // Объединяем встроенные и пользовательские
        const allCats = [...BUILT_IN_CATEGORIES, ...state.categories.filter(c => !c.isBuiltIn)];
        return allCats.sort((a, b) => a.order - b.order);
      },
      
      // ==================== ШАБЛОНЫ ====================
      
      addTemplate: (templateData) => {
        const id = generateId();
        const template: StampTemplate = {
          ...templateData,
          id,
          isBuiltIn: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          templates: [...state.templates, template],
        }));
        return id;
      },
      
      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },
      
      deleteTemplate: (id) => {
        const template = get().templates.find((t) => t.id === id);
        if (!template || template.isBuiltIn) return false;
        
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }));
        return true;
      },
      
      getTemplatesByCategory: (categoryId) => {
        return get().templates.filter((t) => t.categoryId === categoryId);
      },
      
      getAllTemplates: () => {
        return get().templates;
      },
      
      // ==================== ГЕНЕРАТОР ====================
      
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
        
        // Поиск по всем иконкам
        for (const icon of allIcons) {
          const tags = state.iconTags[icon.name] || [];
          const displayName = icon.displayName.toLowerCase();
          
          // Проверяем совпадение по тегам или displayName
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
      
      // ==================== ИНИЦИАЛИЗАЦИЯ ====================
      
      initializeBuiltInData: () => {
        // Встроенные категории добавляются через BUILT_IN_CATEGORIES
        // Здесь можно добавить встроенные шаблоны если нужно
      },
    }),
    {
      name: 'stamp-templates-storage',
      partialize: (state) => ({
        categories: state.categories.filter(c => !c.isBuiltIn),
        templates: state.templates,
        generatorTemplates: state.generatorTemplates,
        iconTags: state.iconTags,
      }),
    }
  )
);
