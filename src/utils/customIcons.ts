/**
 * Утилиты для работы с кастомными категориями и SVG-файлами
 * Хранение в localStorage
 */

const CUSTOM_CATEGORIES_KEY = 'customIconCategories';
const CUSTOM_SETTINGS_KEY = 'customIconSettings';

export interface CustomIcon {
  id: string;
  name: string; // системное имя (например: logo-1)
  displayName: string; // читабельное название
  svgContent: string; // минифицированный SVG
  createdAt: number;
}

export interface CustomCategory {
  id: string;
  name: string; // название категории
  icons: CustomIcon[];
  createdAt: number;
  updatedAt: number;
}

export interface CustomIconSettings {
  version: number;
  lastSync: number;
  totalIcons: number;
  totalCategories: number;
}

/**
 * Генерация уникального ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Загрузка категорий из localStorage
 */
export function loadCustomCategories(): CustomCategory[] {
  try {
    const data = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    if (!data) return [];
    return JSON.parse(data) as CustomCategory[];
  } catch (error) {
    console.error('Ошибка загрузки кастомных категорий:', error);
    return [];
  }
}

/**
 * Сохранение категорий в localStorage
 */
export function saveCustomCategories(categories: CustomCategory[]): void {
  try {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));

    // Обновляем настройки
    const totalIcons = categories.reduce((sum, cat) => sum + cat.icons.length, 0);
    const settings: CustomIconSettings = {
      version: 1,
      lastSync: Date.now(),
      totalIcons,
      totalCategories: categories.length,
    };
    localStorage.setItem(CUSTOM_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Ошибка сохранения кастомных категорий:', error);
    throw new Error('Не удалось сохранить категории. Возможно, превышен лимит localStorage.');
  }
}

/**
 * Получение настроек
 */
export function getCustomIconSettings(): CustomIconSettings {
  try {
    const data = localStorage.getItem(CUSTOM_SETTINGS_KEY);
    if (!data) {
      return { version: 1, lastSync: 0, totalIcons: 0, totalCategories: 0 };
    }
    return JSON.parse(data) as CustomIconSettings;
  } catch (error) {
    console.error('Ошибка загрузки настроек:', error);
    return { version: 1, lastSync: 0, totalIcons: 0, totalCategories: 0 };
  }
}

/**
 * Создание новой категории
 */
export function addCategory(name: string): CustomCategory {
  const categories = loadCustomCategories();

  const newCategory: CustomCategory = {
    id: generateId(),
    name: name.trim(),
    icons: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  categories.push(newCategory);
  saveCustomCategories(categories);

  return newCategory;
}

/**
 * Обновление (переименование) категории
 */
export function updateCategory(categoryId: string, newName: string): boolean {
  const categories = loadCustomCategories();
  const category = categories.find(cat => cat.id === categoryId);

  if (!category) {
    return false;
  }

  category.name = newName.trim();
  category.updatedAt = Date.now();

  saveCustomCategories(categories);
  return true;
}

/**
 * Удаление категории
 */
export function deleteCategory(categoryId: string): boolean {
  const categories = loadCustomCategories();
  const index = categories.findIndex(cat => cat.id === categoryId);

  if (index === -1) {
    return false;
  }

  categories.splice(index, 1);
  saveCustomCategories(categories);
  return true;
}

/**
 * Получение категории по ID
 */
export function getCategoryById(categoryId: string): CustomCategory | null {
  const categories = loadCustomCategories();
  return categories.find(cat => cat.id === categoryId) || null;
}

/**
 * Добавление SVG-иконки в категорию
 */
export function addIcon(
  categoryId: string,
  name: string,
  displayName: string,
  svgContent: string
): CustomIcon | null {
  const categories = loadCustomCategories();
  const category = categories.find(cat => cat.id === categoryId);

  if (!category) {
    return null;
  }

  const newIcon: CustomIcon = {
    id: generateId(),
    name: name.trim(),
    displayName: displayName.trim(),
    svgContent: svgContent.trim(),
    createdAt: Date.now(),
  };

  category.icons.push(newIcon);
  category.updatedAt = Date.now();

  saveCustomCategories(categories);
  return newIcon;
}

/**
 * Обновление иконки
 */
export function updateIcon(
  categoryId: string,
  iconId: string,
  updates: { name?: string; displayName?: string; svgContent?: string }
): boolean {
  const categories = loadCustomCategories();
  const category = categories.find(cat => cat.id === categoryId);

  if (!category) {
    return false;
  }

  const icon = category.icons.find(ico => ico.id === iconId);

  if (!icon) {
    return false;
  }

  if (updates.name) icon.name = updates.name.trim();
  if (updates.displayName) icon.displayName = updates.displayName.trim();
  if (updates.svgContent) icon.svgContent = updates.svgContent.trim();

  category.updatedAt = Date.now();
  saveCustomCategories(categories);
  return true;
}

/**
 * Удаление иконки из категории
 */
export function deleteIcon(categoryId: string, iconId: string): boolean {
  const categories = loadCustomCategories();
  const category = categories.find(cat => cat.id === categoryId);

  if (!category) {
    return false;
  }

  const index = category.icons.findIndex(ico => ico.id === iconId);

  if (index === -1) {
    return false;
  }

  category.icons.splice(index, 1);
  category.updatedAt = Date.now();

  saveCustomCategories(categories);
  return true;
}

/**
 * Перемещение иконки между категориями
 */
export function moveIcon(iconId: string, fromCategoryId: string, toCategoryId: string): boolean {
  const categories = loadCustomCategories();
  const fromCategory = categories.find(cat => cat.id === fromCategoryId);
  const toCategory = categories.find(cat => cat.id === toCategoryId);

  if (!fromCategory || !toCategory) {
    return false;
  }

  const iconIndex = fromCategory.icons.findIndex(ico => ico.id === iconId);

  if (iconIndex === -1) {
    return false;
  }

  const [icon] = fromCategory.icons.splice(iconIndex, 1);
  toCategory.icons.push(icon);

  fromCategory.updatedAt = Date.now();
  toCategory.updatedAt = Date.now();

  saveCustomCategories(categories);
  return true;
}

/**
 * Экспорт всех категорий в JSON
 */
export function exportCategoriesToJSON(): string {
  const categories = loadCustomCategories();
  const settings = getCustomIconSettings();

  const exportData = {
    version: settings.version,
    exportDate: Date.now(),
    categories,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Импорт категорий из JSON
 */
export function importCategoriesFromJSON(jsonString: string, merge = false): boolean {
  try {
    const importData = JSON.parse(jsonString);

    if (!importData.categories || !Array.isArray(importData.categories)) {
      throw new Error('Неверный формат данных');
    }

    // Валидация структуры
    for (const cat of importData.categories) {
      if (!cat.id || !cat.name || !Array.isArray(cat.icons)) {
        throw new Error('Неверная структура категории');
      }
    }

    let categories: CustomCategory[];

    if (merge) {
      // Объединение с существующими категориями
      const existing = loadCustomCategories();
      categories = [...existing, ...importData.categories];
    } else {
      // Полная замена
      categories = importData.categories;
    }

    saveCustomCategories(categories);
    return true;
  } catch (error) {
    console.error('Ошибка импорта категорий:', error);
    return false;
  }
}

/**
 * Сброс всех данных
 */
export function resetAllData(): void {
  localStorage.removeItem(CUSTOM_CATEGORIES_KEY);
  localStorage.removeItem(CUSTOM_SETTINGS_KEY);
}

/**
 * Получить размер данных в localStorage (приблизительно)
 */
export function getStorageSize(): { bytes: number; megabytes: number; percentage: number } {
  try {
    const data = localStorage.getItem(CUSTOM_CATEGORIES_KEY) || '';
    const bytes = new Blob([data]).size;
    const megabytes = bytes / (1024 * 1024);

    // Примерный лимит localStorage - 5 МБ (зависит от браузера)
    const percentage = (bytes / (5 * 1024 * 1024)) * 100;

    return { bytes, megabytes, percentage };
  } catch (error) {
    console.error('Ошибка подсчета размера:', error);
    return { bytes: 0, megabytes: 0, percentage: 0 };
  }
}

/**
 * Проверка наличия категории с таким именем
 */
export function isCategoryNameExists(name: string, excludeId?: string): boolean {
  const categories = loadCustomCategories();
  const trimmedName = name.trim().toLowerCase();

  return categories.some(
    cat => cat.name.toLowerCase() === trimmedName && cat.id !== excludeId
  );
}

/**
 * Проверка наличия иконки с таким именем в категории
 */
export function isIconNameExists(categoryId: string, name: string, excludeId?: string): boolean {
  const category = getCategoryById(categoryId);
  if (!category) return false;

  const trimmedName = name.trim().toLowerCase();

  return category.icons.some(
    ico => ico.name.toLowerCase() === trimmedName && ico.id !== excludeId
  );
}
