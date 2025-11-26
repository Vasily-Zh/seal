import type { FontConfig } from '../types';

// Только шрифты с поддержкой векторизации через Google Fonts CDN
// Синхронизировано с textToPath.ts (52 шрифта)
export const ALL_FONTS: FontConfig[] = [
  // Системные шрифты с Google Fonts эквивалентами (8 шрифтов)
  {
    name: 'Arial',
    family: 'Arial',
    category: 'sans-serif',
  },
  {
    name: 'Comic Neue',
    family: 'Comic Neue',
    category: 'sans-serif',
  },
  {
    name: 'Courier New',
    family: 'Courier New',
    category: 'monospace',
  },
  {
    name: 'Georgia',
    family: 'Georgia',
    category: 'serif',
  },
  {
    name: 'Impact',
    family: 'Impact',
    category: 'sans-serif',
  },
  {
    name: 'Tahoma',
    family: 'Tahoma',
    category: 'sans-serif',
  },
  {
    name: 'Times New Roman',
    family: 'Times New Roman',
    category: 'serif',
  },
  {
    name: 'Verdana',
    family: 'Verdana',
    category: 'sans-serif',
  },

  // Google Fonts (44 шрифта)
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
    category: 'monospace',
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
  {
    name: 'Ubuntu',
    family: 'Ubuntu',
    category: 'sans-serif',
  },
];
