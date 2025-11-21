import type { FontConfig } from '../types';

// Web-safe и Google Fonts шрифты

export const SERIF_FONTS: FontConfig[] = [
  { name: 'Times New Roman', family: 'Times New Roman, serif', category: 'serif' },
];

export const SANS_SERIF_FONTS: FontConfig[] = [
  { name: 'Arial', family: 'Arial, sans-serif', category: 'sans-serif' },
  { name: 'Roboto', family: 'Roboto', category: 'sans-serif' },
  { name: 'Open Sans', family: 'Open Sans', category: 'sans-serif' },
  { name: 'Ubuntu', family: 'Ubuntu', category: 'sans-serif' },
];

export const ALL_FONTS: FontConfig[] = [...SERIF_FONTS, ...SANS_SERIF_FONTS];

// Генерация ссылки для подключения шрифтов через Google Fonts API
export const getGoogleFontsUrl = (): string => {
  const googleFonts = ['Roboto', 'Open Sans', 'Ubuntu'];
  const families = googleFonts.map(font => font.replace(/ /g, '+')).join('&family=');
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
};
