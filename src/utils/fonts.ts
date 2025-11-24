import type { FontConfig } from '../types';

// Полиграфические шрифты
export const PRINTING_FONTS: FontConfig[] = [
  {
    name: 'Arial',
    family: 'Arial, sans-serif',
    category: 'sans-serif',
    isPrintingFont: true,
  },
  {
    name: 'Arial Narrow',
    family: 'Arial Narrow, Arial, sans-serif',
    category: 'sans-serif',
    isPrintingFont: true,
  },
  {
    name: 'Times New Roman',
    family: 'Times New Roman, serif',
    category: 'serif',
    isPrintingFont: true,
  },
  {
    name: 'Garamond',
    family: 'Garamond, serif',
    category: 'serif',
    isPrintingFont: true,
  },
  {
    name: 'Helvetica',
    family: 'Helvetica, Arial, sans-serif',
    category: 'sans-serif',
    isPrintingFont: true,
  },
  {
    name: 'Georgia',
    family: 'Georgia, serif',
    category: 'serif',
    isPrintingFont: true,
  },
];

// Дополнительные шрифты (sans-serif)
export const ADDITIONAL_SANS_SERIF_FONTS: FontConfig[] = [
  {
    name: 'Calibri',
    family: 'Calibri, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Verdana',
    family: 'Verdana, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Tahoma',
    family: 'Tahoma, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Franklin Gothic',
    family: 'Franklin Gothic Medium, Franklin Gothic, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Impact',
    family: 'Impact, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Microsoft Sans Serif',
    family: 'Microsoft Sans Serif, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Candara',
    family: 'Candara, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Comic Sans MS',
    family: 'Comic Sans MS, cursive, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'DejaVu Sans',
    family: 'DejaVu Sans, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Sylfaen',
    family: 'Sylfaen, serif',
    category: 'serif',
  },
];

// Дополнительные serif шрифты для штемпельного дела
export const ADDITIONAL_SERIF_FONTS: FontConfig[] = [
  {
    name: 'Cambria',
    family: 'Cambria, serif',
    category: 'serif',
  },
  {
    name: 'Baskerville',
    family: 'Baskerville, serif',
    category: 'serif',
  },
  {
    name: 'Bodoni',
    family: 'Bodoni MT, Bodoni, serif',
    category: 'serif',
  },
  {
    name: 'Didot',
    family: 'Didot, serif',
    category: 'serif',
  },
];

// Специальные декоративные шрифты
export const DECORATIVE_FONTS: FontConfig[] = [
  {
    name: 'Monotype Corsiva',
    family: 'Monotype Corsiva, cursive',
    category: 'serif',
  },
];

// Google Fonts (будут загружены динамически)
// Все шрифты открытые и бесплатные (OFL лицензия)
export const GOOGLE_FONTS: FontConfig[] = [
  // Официальные/строгие Sans-Serif для штемпелей
  {
    name: 'Inter',
    family: 'Inter',
    category: 'sans-serif',
  },
  {
    name: 'PT Sans',
    family: 'PT Sans',
    category: 'sans-serif',
  },
  {
    name: 'Fira Sans',
    family: 'Fira Sans',
    category: 'sans-serif',
  },
  {
    name: 'Fira Code',
    family: 'Fira Code',
    category: 'sans-serif',
  },
  {
    name: 'IBM Plex Sans',
    family: 'IBM Plex Sans',
    category: 'sans-serif',
  },
  {
    name: 'Commissioner',
    family: 'Commissioner',
    category: 'sans-serif',
  },
  {
    name: 'Manrope',
    family: 'Manrope',
    category: 'sans-serif',
  },
  {
    name: 'Public Sans',
    family: 'Public Sans',
    category: 'sans-serif',
  },
  {
    name: 'Noto Sans',
    family: 'Noto Sans',
    category: 'sans-serif',
  },

  // Популярные Sans-Serif
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
    name: 'Nunito',
    family: 'Nunito',
    category: 'sans-serif',
  },
  {
    name: 'Poppins',
    family: 'Poppins',
    category: 'sans-serif',
  },
  {
    name: 'Mulish',
    family: 'Mulish',
    category: 'sans-serif',
  },
  {
    name: 'Karla',
    family: 'Karla',
    category: 'sans-serif',
  },
  {
    name: 'Ubuntu',
    family: 'Ubuntu',
    category: 'sans-serif',
  },
  {
    name: 'Carlito',
    family: 'Carlito',
    category: 'sans-serif',
  },

  // Display/Header Sans-Serif
  {
    name: 'Oswald',
    family: 'Oswald',
    category: 'sans-serif',
  },
  {
    name: 'Bebas Neue',
    family: 'Bebas Neue',
    category: 'sans-serif',
  },
  {
    name: 'Anton',
    family: 'Anton',
    category: 'sans-serif',
  },
  {
    name: 'Archivo',
    family: 'Archivo',
    category: 'sans-serif',
  },
  {
    name: 'League Gothic',
    family: 'League Gothic',
    category: 'sans-serif',
  },

  // Округлые/мягкие Sans-Serif
  {
    name: 'Comic Neue',
    family: 'Comic Neue',
    category: 'sans-serif',
  },
  {
    name: 'Baloo 2',
    family: 'Baloo 2',
    category: 'sans-serif',
  },
  {
    name: 'Fredoka',
    family: 'Fredoka',
    category: 'sans-serif',
  },

  // Классические Serif для штемпелей
  {
    name: 'PT Serif',
    family: 'PT Serif',
    category: 'serif',
  },
  {
    name: 'Crimson Pro',
    family: 'Crimson Pro',
    category: 'serif',
  },
  {
    name: 'EB Garamond',
    family: 'EB Garamond',
    category: 'serif',
  },
  {
    name: 'Cormorant Garamond',
    family: 'Cormorant Garamond',
    category: 'serif',
  },
  {
    name: 'Libre Baskerville',
    family: 'Libre Baskerville',
    category: 'serif',
  },

  // Популярные Serif
  {
    name: 'Merriweather',
    family: 'Merriweather',
    category: 'serif',
  },
  {
    name: 'Playfair Display',
    family: 'Playfair Display',
    category: 'serif',
  },
  {
    name: 'IBM Plex Serif',
    family: 'IBM Plex Serif',
    category: 'serif',
  },
  {
    name: 'Source Serif 4',
    family: 'Source Serif 4',
    category: 'serif',
  },
  {
    name: 'Literata',
    family: 'Literata',
    category: 'serif',
  },
  {
    name: 'Bodoni Moda',
    family: 'Bodoni Moda',
    category: 'serif',
  },
  {
    name: 'Noto Serif',
    family: 'Noto Serif',
    category: 'serif',
  },

  // Декоративные/Script (для красивых надписей)
  {
    name: 'Great Vibes',
    family: 'Great Vibes',
    category: 'serif',
  },
  {
    name: 'Alex Brush',
    family: 'Alex Brush',
    category: 'serif',
  },
  {
    name: 'Parisienne',
    family: 'Parisienne',
    category: 'serif',
  },
];

// Полный список всех шрифтов в правильном порядке
export const ALL_FONTS: FontConfig[] = [
  ...PRINTING_FONTS, // сначала полиграфические
  ...ADDITIONAL_SANS_SERIF_FONTS,
  ...ADDITIONAL_SERIF_FONTS,
  ...DECORATIVE_FONTS,
  ...GOOGLE_FONTS,
];

// Генерация ссылки для подключения шрифтов через Google Fonts API
export const getGoogleFontsUrl = (): string => {
  const googleFontNames = GOOGLE_FONTS.map(font => font.name);
  const families = googleFontNames.map(font => {
    const base = font.replace(/ /g, '+');
    // Подключаем несколько начертаний
    return `${base}:ital,wght@0,400;0,700;1,400;1,700`;
  }).join('&family=');
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
};
