import type { FontConfig } from '../types';

// Все шрифты отсортированы по алфавиту
// Включая системные шрифты, Google Fonts и рукописные шрифты для печатей
export const ALL_FONTS: FontConfig[] = [
  // Системные шрифты (встроенные, всегда доступны)
  {
    name: 'Arial',
    family: 'Arial, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Arial Narrow',
    family: 'Arial Narrow, Arial, sans-serif',
    category: 'sans-serif',
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
    name: 'Calibri',
    family: 'Calibri, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Cambria',
    family: 'Cambria, serif',
    category: 'serif',
  },
  {
    name: 'Candara',
    family: 'Candara, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Carlito',
    family: 'Carlito',
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
    name: 'Didot',
    family: 'Didot, serif',
    category: 'serif',
  },
  {
    name: 'Franklin Gothic',
    family: 'Franklin Gothic Medium, Franklin Gothic, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Garamond',
    family: 'Garamond, serif',
    category: 'serif',
  },
  {
    name: 'Georgia',
    family: 'Georgia, serif',
    category: 'serif',
  },
  {
    name: 'Helvetica',
    family: 'Helvetica, Arial, sans-serif',
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
    name: 'Monotype Corsiva',
    family: 'Monotype Corsiva, cursive',
    category: 'serif',
  },
  {
    name: 'Sylfaen',
    family: 'Sylfaen, serif',
    category: 'serif',
  },
  {
    name: 'Tahoma',
    family: 'Tahoma, sans-serif',
    category: 'sans-serif',
  },
  {
    name: 'Times New Roman',
    family: 'Times New Roman, serif',
    category: 'serif',
  },
  {
    name: 'Ubuntu',
    family: 'Ubuntu',
    category: 'sans-serif',
  },
  {
    name: 'Verdana',
    family: 'Verdana, sans-serif',
    category: 'sans-serif',
  },

  // Google Fonts (открытые, бесплатные, OFL лицензия)
  {
    name: 'Alex Brush',
    family: 'Alex Brush',
    category: 'serif',
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
    name: 'Baloo 2',
    family: 'Baloo 2',
    category: 'sans-serif',
  },
  {
    name: 'Bebas Neue',
    family: 'Bebas Neue',
    category: 'sans-serif',
  },
  {
    name: 'Bodoni Moda',
    family: 'Bodoni Moda',
    category: 'serif',
  },
  {
    name: 'Caveat',
    family: 'Caveat',
    category: 'serif',
  },
  {
    name: 'Commissioner',
    family: 'Commissioner',
    category: 'sans-serif',
  },
  {
    name: 'Comic Neue',
    family: 'Comic Neue',
    category: 'sans-serif',
  },
  {
    name: 'Cormorant Garamond',
    family: 'Cormorant Garamond',
    category: 'serif',
  },
  {
    name: 'Crimson Pro',
    family: 'Crimson Pro',
    category: 'serif',
  },
  {
    name: 'Dancing Script',
    family: 'Dancing Script',
    category: 'serif',
  },
  {
    name: 'EB Garamond',
    family: 'EB Garamond',
    category: 'serif',
  },
  {
    name: 'Fira Code',
    family: 'Fira Code',
    category: 'sans-serif',
  },
  {
    name: 'Fira Sans',
    family: 'Fira Sans',
    category: 'sans-serif',
  },
  {
    name: 'Fredoka',
    family: 'Fredoka',
    category: 'sans-serif',
  },
  {
    name: 'Great Vibes',
    family: 'Great Vibes',
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
    name: 'Inter',
    family: 'Inter',
    category: 'sans-serif',
  },
  {
    name: 'Karla',
    family: 'Karla',
    category: 'sans-serif',
  },
  {
    name: 'Kaushan Script',
    family: 'Kaushan Script',
    category: 'serif',
  },
  {
    name: 'League Gothic',
    family: 'League Gothic',
    category: 'sans-serif',
  },
  {
    name: 'Libre Baskerville',
    family: 'Libre Baskerville',
    category: 'serif',
  },
  {
    name: 'Literata',
    family: 'Literata',
    category: 'serif',
  },
  {
    name: 'Manrope',
    family: 'Manrope',
    category: 'sans-serif',
  },
  {
    name: 'Merriweather',
    family: 'Merriweather',
    category: 'serif',
  },
  {
    name: 'Mulish',
    family: 'Mulish',
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
    name: 'Nunito',
    family: 'Nunito',
    category: 'sans-serif',
  },
  {
    name: 'Open Sans',
    family: 'Open Sans',
    category: 'sans-serif',
  },
  {
    name: 'Oswald',
    family: 'Oswald',
    category: 'sans-serif',
  },
  {
    name: 'Parisienne',
    family: 'Parisienne',
    category: 'serif',
  },
  {
    name: 'Playfair Display',
    family: 'Playfair Display',
    category: 'serif',
  },
  {
    name: 'Poppins',
    family: 'Poppins',
    category: 'sans-serif',
  },
  {
    name: 'PT Sans',
    family: 'PT Sans',
    category: 'sans-serif',
  },
  {
    name: 'PT Serif',
    family: 'PT Serif',
    category: 'serif',
  },
  {
    name: 'Public Sans',
    family: 'Public Sans',
    category: 'sans-serif',
  },
  {
    name: 'Roboto',
    family: 'Roboto',
    category: 'sans-serif',
  },
  {
    name: 'Sacramento',
    family: 'Sacramento',
    category: 'serif',
  },
  {
    name: 'Satisfy',
    family: 'Satisfy',
    category: 'serif',
  },
  {
    name: 'Source Serif 4',
    family: 'Source Serif 4',
    category: 'serif',
  },
  {
    name: 'Tangerine',
    family: 'Tangerine',
    category: 'serif',
  },
];

// Генерация ссылки для подключения шрифтов через Google Fonts API
export const getGoogleFontsUrl = (): string => {
  // Google Fonts для загрузки (исключаем системные шрифты)
  const googleFontNames = [
    'Alex Brush',
    'Anton',
    'Archivo',
    'Baloo 2',
    'Bebas Neue',
    'Bodoni Moda',
    'Caveat',
    'Commissioner',
    'Comic Neue',
    'Cormorant Garamond',
    'Crimson Pro',
    'Dancing Script',
    'EB Garamond',
    'Fira Code',
    'Fira Sans',
    'Fredoka',
    'Great Vibes',
    'IBM Plex Sans',
    'IBM Plex Serif',
    'Inter',
    'Karla',
    'Kaushan Script',
    'League Gothic',
    'Libre Baskerville',
    'Literata',
    'Manrope',
    'Merriweather',
    'Mulish',
    'Noto Sans',
    'Noto Serif',
    'Nunito',
    'Open Sans',
    'Oswald',
    'Parisienne',
    'Playfair Display',
    'Poppins',
    'PT Sans',
    'PT Serif',
    'Public Sans',
    'Roboto',
    'Sacramento',
    'Satisfy',
    'Source Serif 4',
    'Tangerine',
  ];

  const families = googleFontNames.map(font => {
    const base = font.replace(/ /g, '+');
    // Подключаем несколько начертаний
    return `${base}:ital,wght@0,400;0,700;1,400;1,700`;
  }).join('&family=');
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
};
