import type { FontConfig } from '../types';

/**
 * Шрифты для конструктора печатей и штампов
 * Синхронизировано с textToPath.ts (25 проверенных шрифтов)
 * Все шрифты имеют рабочие TTF URL через jsDelivr CDN
 */
export const ALL_FONTS: FontConfig[] = [
  // ============================================
  // ОСНОВНЫЕ ШРИФТЫ ДЛЯ ПЕЧАТЕЙ (чёткие, строгие)
  // ============================================
  {
    name: 'Roboto',
    family: 'Roboto',
    category: 'sans-serif',
  },
  {
    name: 'Open Sans',
    family: 'Open Sans',
    category: 'sans-serif',
  },
  {
    name: 'Noto Sans',
    family: 'Noto Sans',
    category: 'sans-serif',
  },
  {
    name: 'Noto Serif',
    family: 'Noto Serif',
    category: 'serif',
  },
  {
    name: 'Oswald',
    family: 'Oswald',
    category: 'sans-serif',
  },
  {
    name: 'Montserrat',
    family: 'Montserrat',
    category: 'sans-serif',
  },
  {
    name: 'Inter',
    family: 'Inter',
    category: 'sans-serif',
  },
  {
    name: 'Ubuntu',
    family: 'Ubuntu',
    category: 'sans-serif',
  },
  {
    name: 'Nunito',
    family: 'Nunito',
    category: 'sans-serif',
  },
  {
    name: 'Poppins',
    family: 'Poppins',
    category: 'sans-serif',
  },

  // ============================================
  // SERIF ШРИФТЫ (для официальных документов)
  // ============================================
  {
    name: 'Playfair Display',
    family: 'Playfair Display',
    category: 'serif',
  },
  {
    name: 'Merriweather',
    family: 'Merriweather',
    category: 'serif',
  },
  {
    name: 'Libre Baskerville',
    family: 'Libre Baskerville',
    category: 'serif',
  },
  {
    name: 'IBM Plex Sans',
    family: 'IBM Plex Sans',
    category: 'sans-serif',
  },
  {
    name: 'IBM Plex Serif',
    family: 'IBM Plex Serif',
    category: 'serif',
  },
  {
    name: 'Source Serif',
    family: 'Source Serif',
    category: 'serif',
  },
  {
    name: 'Fira Sans',
    family: 'Fira Sans',
    category: 'sans-serif',
  },

  // ============================================
  // DISPLAY ШРИФТЫ (для заголовков на печатях)
  // ============================================
  {
    name: 'Anton',
    family: 'Anton',
    category: 'sans-serif',
  },
  {
    name: 'Raleway',
    family: 'Raleway',
    category: 'sans-serif',
  },

  // ============================================
  // МОНОШИРИННЫЕ (для номеров, ИНН, ОГРН)
  // ============================================
  {
    name: 'Fira Code',
    family: 'Fira Code',
    category: 'sans-serif', // технически monospace, но тип не поддерживает
  },
  {
    name: 'JetBrains Mono',
    family: 'JetBrains Mono',
    category: 'sans-serif',
  },
  {
    name: 'Source Code Pro',
    family: 'Source Code Pro',
    category: 'sans-serif',
  },

  // ============================================
  // РУКОПИСНЫЕ (для подписей, декоративных печатей)
  // ============================================
  {
    name: 'Dancing Script',
    family: 'Dancing Script',
    category: 'serif', // технически handwriting/script
  },
  {
    name: 'Caveat',
    family: 'Caveat',
    category: 'serif',
  },
  {
    name: 'Pacifico',
    family: 'Pacifico',
    category: 'serif',
  },
];

/**
 * Шрифт по умолчанию
 */
export const DEFAULT_FONT = 'Roboto';

/**
 * Получить конфиг шрифта по имени
 */
export function getFontConfig(fontName: string): FontConfig | undefined {
  return ALL_FONTS.find(f => f.family === fontName || f.name === fontName);
}

/**
 * Получить шрифты по категории
 */
export function getFontsByCategory(category: 'serif' | 'sans-serif'): FontConfig[] {
  return ALL_FONTS.filter(f => f.category === category);
}