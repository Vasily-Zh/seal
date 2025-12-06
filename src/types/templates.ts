// Типы для системы шаблонов и генератора печатей

import type { StampElement } from './index';

// ==================== КАТЕГОРИИ ====================

export interface TemplateCategory {
  id: string;
  name: string;              // "Печати для ИП"
  order: number;             // порядок в карусели
  isBuiltIn: boolean;        // встроенная (нельзя удалить)
}

// Встроенные категории по умолчанию
export const BUILT_IN_CATEGORIES: TemplateCategory[] = [
  { id: 'ip', name: 'Печати для ИП', order: 1, isBuiltIn: true },
  { id: 'ooo', name: 'Печати для ООО', order: 2, isBuiltIn: true },
  { id: 'medical', name: 'Медицинские печати', order: 3, isBuiltIn: true },
  { id: 'selfemployed', name: 'Самозанятые', order: 4, isBuiltIn: true },
];

// ==================== ШАБЛОНЫ ====================

export interface StampTemplate {
  id: string;
  categoryId: string;        // ID категории
  name: string;              // "ООО Классическая"
  elements: StampElement[];  // элементы макета
  canvasSize: { width: number; height: number };
  thumbnail?: string;        // base64 превью (генерируется автоматически)
  isBuiltIn: boolean;        // встроенный шаблон
  createdAt: string;
}

// ==================== БАЗОВЫЕ ШАБЛОНЫ ДЛЯ ГЕНЕРАТОРА ====================

export interface GeneratorBaseTemplate {
  id: string;
  name: string;              // "ООО стандартный"
  type: 'ip' | 'ooo' | 'medical' | 'selfemployed' | 'custom';
  elements: StampElement[];  // элементы макета (без центральной иконки)
  canvasSize: { width: number; height: number };
  // Позиция для вставки иконки
  iconPosition: {
    x: number;               // координата X центра иконки (в мм)
    y: number;               // координата Y центра иконки (в мм)
    size: number;            // размер иконки (ширина/высота в мм)
  };
  isBuiltIn: boolean;
  createdAt: string;
}

// ==================== ИКОНКИ С ТЕГАМИ ====================

export interface IconWithTags {
  name: string;
  source: 'lucide' | 'heroicons' | 'custom';
  displayName: string;
  tags: string[];            // русские теги для поиска
  svgContent?: string;       // для custom SVG
}

// ==================== ХРАНИЛИЩЕ ====================

export interface TemplatesStore {
  // Категории
  categories: TemplateCategory[];
  
  // Шаблоны по категориям
  templates: StampTemplate[];
  
  // Базовые шаблоны для генератора
  generatorTemplates: GeneratorBaseTemplate[];
  
  // Методы категорий
  addCategory: (category: Omit<TemplateCategory, 'id' | 'isBuiltIn'>) => string;
  updateCategory: (id: string, updates: Partial<TemplateCategory>) => void;
  deleteCategory: (id: string) => boolean; // false если встроенная
  reorderCategories: (ids: string[]) => void;
  
  // Методы шаблонов
  addTemplate: (template: Omit<StampTemplate, 'id' | 'isBuiltIn' | 'createdAt'>) => string;
  updateTemplate: (id: string, updates: Partial<StampTemplate>) => void;
  deleteTemplate: (id: string) => boolean;
  getTemplatesByCategory: (categoryId: string) => StampTemplate[];
  
  // Методы генератора
  addGeneratorTemplate: (template: Omit<GeneratorBaseTemplate, 'id' | 'isBuiltIn' | 'createdAt'>) => string;
  updateGeneratorTemplate: (id: string, updates: Partial<GeneratorBaseTemplate>) => void;
  deleteGeneratorTemplate: (id: string) => boolean;
  
  // Поиск иконок по тегам
  searchIconsByTag: (query: string) => IconWithTags[];
}

// ==================== КЛЮЧИ LOCALSTORAGE ====================

export const STORAGE_KEYS = {
  CUSTOM_CATEGORIES: 'stamp-custom-categories',
  CUSTOM_TEMPLATES: 'stamp-custom-templates',
  GENERATOR_TEMPLATES: 'stamp-generator-templates',
  ICON_TAGS: 'stamp-icon-tags',
} as const;
