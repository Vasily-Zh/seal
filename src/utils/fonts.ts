import type { FontConfig } from '../types';

// Популярные бесплатные шрифты с Google Fonts

export const SERIF_FONTS: FontConfig[] = [
  { name: 'Playfair Display', family: 'Playfair Display', category: 'serif' },
  { name: 'Merriweather', family: 'Merriweather', category: 'serif' },
  { name: 'Lora', family: 'Lora', category: 'serif' },
  { name: 'PT Serif', family: 'PT Serif', category: 'serif' },
  { name: 'Crimson Text', family: 'Crimson Text', category: 'serif' },
];

export const SANS_SERIF_FONTS: FontConfig[] = [
  { name: 'Roboto', family: 'Roboto', category: 'sans-serif' },
  { name: 'Open Sans', family: 'Open Sans', category: 'sans-serif' },
  { name: 'Montserrat', family: 'Montserrat', category: 'sans-serif' },
  { name: 'Raleway', family: 'Raleway', category: 'sans-serif' },
  { name: 'Ubuntu', family: 'Ubuntu', category: 'sans-serif' },
];

export const ALL_FONTS: FontConfig[] = [...SERIF_FONTS, ...SANS_SERIF_FONTS];

// Генерация ссылки для подключения шрифтов через Google Fonts API
export const getGoogleFontsUrl = (): string => {
  const families = ALL_FONTS.map(font => font.family.replace(/ /g, '+')).join('&family=');
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
};
