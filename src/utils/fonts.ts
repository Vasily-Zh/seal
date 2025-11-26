import type { FontConfig } from '../types';

/**
 * 100 шрифтов для конструктора печатей и штампов
 * Синхронизировано с textToPath.ts
 */
export const ALL_FONTS: FontConfig[] = [
  // =============================================
  // SANS-SERIF ШРИФТЫ (40 шрифтов)
  // =============================================
  { name: 'Roboto', family: 'Roboto', category: 'sans-serif' },
  { name: 'Open Sans', family: 'Open Sans', category: 'sans-serif' },
  { name: 'Noto Sans', family: 'Noto Sans', category: 'sans-serif' },
  { name: 'Oswald', family: 'Oswald', category: 'sans-serif' },
  { name: 'Montserrat', family: 'Montserrat', category: 'sans-serif' },
  { name: 'Inter', family: 'Inter', category: 'sans-serif' },
  { name: 'Ubuntu', family: 'Ubuntu', category: 'sans-serif' },
  { name: 'Nunito', family: 'Nunito', category: 'sans-serif' },
  { name: 'Poppins', family: 'Poppins', category: 'sans-serif' },
  { name: 'IBM Plex Sans', family: 'IBM Plex Sans', category: 'sans-serif' },
  { name: 'Fira Sans', family: 'Fira Sans', category: 'sans-serif' },
  { name: 'Anton', family: 'Anton', category: 'sans-serif' },
  { name: 'Raleway', family: 'Raleway', category: 'sans-serif' },
  { name: 'Lato', family: 'Lato', category: 'sans-serif' },
  { name: 'Source Sans 3', family: 'Source Sans 3', category: 'sans-serif' },
  { name: 'Work Sans', family: 'Work Sans', category: 'sans-serif' },
  { name: 'Rubik', family: 'Rubik', category: 'sans-serif' },
  { name: 'Barlow', family: 'Barlow', category: 'sans-serif' },
  { name: 'Quicksand', family: 'Quicksand', category: 'sans-serif' },
  { name: 'Titillium Web', family: 'Titillium Web', category: 'sans-serif' },
  { name: 'Cabin', family: 'Cabin', category: 'sans-serif' },
  { name: 'Exo 2', family: 'Exo 2', category: 'sans-serif' },
  { name: 'Josefin Sans', family: 'Josefin Sans', category: 'sans-serif' },
  { name: 'Mukta', family: 'Mukta', category: 'sans-serif' },
  { name: 'Overpass', family: 'Overpass', category: 'sans-serif' },
  { name: 'DM Sans', family: 'DM Sans', category: 'sans-serif' },
  { name: 'Archivo', family: 'Archivo', category: 'sans-serif' },
  { name: 'Asap', family: 'Asap', category: 'sans-serif' },
  { name: 'Hind', family: 'Hind', category: 'sans-serif' },
  { name: 'Karla', family: 'Karla', category: 'sans-serif' },
  { name: 'Oxygen', family: 'Oxygen', category: 'sans-serif' },
  { name: 'Prompt', family: 'Prompt', category: 'sans-serif' },
  { name: 'Questrial', family: 'Questrial', category: 'sans-serif' },
  { name: 'Sarabun', family: 'Sarabun', category: 'sans-serif' },
  { name: 'Signika', family: 'Signika', category: 'sans-serif' },
  { name: 'Varela Round', family: 'Varela Round', category: 'sans-serif' },
  { name: 'Abel', family: 'Abel', category: 'sans-serif' },
  { name: 'Dosis', family: 'Dosis', category: 'sans-serif' },
  { name: 'Kanit', family: 'Kanit', category: 'sans-serif' },
  { name: 'Maven Pro', family: 'Maven Pro', category: 'sans-serif' },

  // =============================================
  // SERIF ШРИФТЫ (25 шрифтов)
  // =============================================
  { name: 'Noto Serif', family: 'Noto Serif', category: 'serif' },
  { name: 'Playfair Display', family: 'Playfair Display', category: 'serif' },
  { name: 'Merriweather', family: 'Merriweather', category: 'serif' },
  { name: 'Libre Baskerville', family: 'Libre Baskerville', category: 'serif' },
  { name: 'IBM Plex Serif', family: 'IBM Plex Serif', category: 'serif' },
  { name: 'Source Serif', family: 'Source Serif', category: 'serif' },
  { name: 'Lora', family: 'Lora', category: 'serif' },
  { name: 'PT Serif', family: 'PT Serif', category: 'serif' },
  { name: 'Crimson Text', family: 'Crimson Text', category: 'serif' },
  { name: 'Bitter', family: 'Bitter', category: 'serif' },
  { name: 'Domine', family: 'Domine', category: 'serif' },
  { name: 'Arvo', family: 'Arvo', category: 'serif' },
  { name: 'Cardo', family: 'Cardo', category: 'serif' },
  { name: 'Vollkorn', family: 'Vollkorn', category: 'serif' },
  { name: 'Neuton', family: 'Neuton', category: 'serif' },
  { name: 'Old Standard TT', family: 'Old Standard TT', category: 'serif' },
  { name: 'Cormorant', family: 'Cormorant', category: 'serif' },
  { name: 'Spectral', family: 'Spectral', category: 'serif' },
  { name: 'Alegreya', family: 'Alegreya', category: 'serif' },
  { name: 'Libre Caslon Text', family: 'Libre Caslon Text', category: 'serif' },
  { name: 'Noticia Text', family: 'Noticia Text', category: 'serif' },
  { name: 'Rokkitt', family: 'Rokkitt', category: 'serif' },
  { name: 'Zilla Slab', family: 'Zilla Slab', category: 'serif' },
  { name: 'Copse', family: 'Copse', category: 'serif' },
  { name: 'Tinos', family: 'Tinos', category: 'serif' },

  // =============================================
  // РУКОПИСНЫЕ / SCRIPT ШРИФТЫ (25 шрифтов)
  // =============================================
  { name: 'Dancing Script', family: 'Dancing Script', category: 'serif' },
  { name: 'Caveat', family: 'Caveat', category: 'serif' },
  { name: 'Pacifico', family: 'Pacifico', category: 'serif' },
  { name: 'Great Vibes', family: 'Great Vibes', category: 'serif' },
  { name: 'Satisfy', family: 'Satisfy', category: 'serif' },
  { name: 'Sacramento', family: 'Sacramento', category: 'serif' },
  { name: 'Kaushan Script', family: 'Kaushan Script', category: 'serif' },
  { name: 'Alex Brush', family: 'Alex Brush', category: 'serif' },
  { name: 'Parisienne', family: 'Parisienne', category: 'serif' },
  { name: 'Tangerine', family: 'Tangerine', category: 'serif' },
  { name: 'Allura', family: 'Allura', category: 'serif' },
  { name: 'Cookie', family: 'Cookie', category: 'serif' },
  { name: 'Courgette', family: 'Courgette', category: 'serif' },
  { name: 'Lobster', family: 'Lobster', category: 'serif' },
  { name: 'Lobster Two', family: 'Lobster Two', category: 'serif' },
  { name: 'Marck Script', family: 'Marck Script', category: 'serif' },
  { name: 'Permanent Marker', family: 'Permanent Marker', category: 'sans-serif' },
  { name: 'Shadows Into Light', family: 'Shadows Into Light', category: 'serif' },
  { name: 'Indie Flower', family: 'Indie Flower', category: 'serif' },
  { name: 'Amatic SC', family: 'Amatic SC', category: 'sans-serif' },
  { name: 'Handlee', family: 'Handlee', category: 'serif' },
  { name: 'Architects Daughter', family: 'Architects Daughter', category: 'serif' },
  { name: 'Patrick Hand', family: 'Patrick Hand', category: 'serif' },
  { name: 'Yellowtail', family: 'Yellowtail', category: 'serif' },
  { name: 'Playball', family: 'Playball', category: 'serif' },

  // =============================================
  // МОНОШИРИННЫЕ ШРИФТЫ (5 шрифтов)
  // =============================================
  { name: 'Fira Code', family: 'Fira Code', category: 'sans-serif' },
  { name: 'JetBrains Mono', family: 'JetBrains Mono', category: 'sans-serif' },
  { name: 'Source Code Pro', family: 'Source Code Pro', category: 'sans-serif' },
  { name: 'IBM Plex Mono', family: 'IBM Plex Mono', category: 'sans-serif' },
  { name: 'Roboto Mono', family: 'Roboto Mono', category: 'sans-serif' },

  // =============================================
  // DISPLAY / ДЕКОРАТИВНЫЕ ШРИФТЫ (5 шрифтов)
  // =============================================
  { name: 'Bebas Neue', family: 'Bebas Neue', category: 'sans-serif' },
  { name: 'Russo One', family: 'Russo One', category: 'sans-serif' },
  { name: 'Black Ops One', family: 'Black Ops One', category: 'sans-serif' },
  { name: 'Bangers', family: 'Bangers', category: 'sans-serif' },
  { name: 'Righteous', family: 'Righteous', category: 'sans-serif' },
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
