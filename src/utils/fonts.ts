import type { FontConfig } from '../types';

// Полиграфические шрифты с вариантами
export const PRINTING_FONTS: FontConfig[] = [
  {
    name: 'Arial',
    family: 'Arial, sans-serif',
    category: 'sans-serif',
    isPrintingFont: true,
    variants: [
      { name: 'Regular', family: 'Arial, sans-serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Arial, sans-serif', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Arial, sans-serif', weight: 400, style: 'italic' },
      { name: 'Bold Italic', family: 'Arial, sans-serif', weight: 700, style: 'italic' },
    ]
  },
  {
    name: 'Arial Narrow',
    family: 'Arial Narrow, Arial, sans-serif',
    category: 'sans-serif',
    isPrintingFont: true,
    variants: [
      { name: 'Regular', family: 'Arial Narrow, Arial, sans-serif', weight: 400, style: 'normal', stretch: 'condensed' },
      { name: 'Bold', family: 'Arial Narrow, Arial, sans-serif', weight: 700, style: 'normal', stretch: 'condensed' },
    ]
  },
  {
    name: 'Times New Roman',
    family: 'Times New Roman, serif',
    category: 'serif',
    isPrintingFont: true,
    variants: [
      { name: 'Regular', family: 'Times New Roman, serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Times New Roman, serif', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Times New Roman, serif', weight: 400, style: 'italic' },
      { name: 'Bold Italic', family: 'Times New Roman, serif', weight: 700, style: 'italic' },
    ]
  },
  {
    name: 'Garamond',
    family: 'Garamond, serif',
    category: 'serif',
    isPrintingFont: true,
    variants: [
      { name: 'Regular', family: 'Garamond, serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Garamond, serif', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Garamond, serif', weight: 400, style: 'italic' },
    ]
  },
  {
    name: 'Helvetica',
    family: 'Helvetica, Arial, sans-serif',
    category: 'sans-serif',
    isPrintingFont: true,
    variants: [
      { name: 'Regular', family: 'Helvetica, Arial, sans-serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Helvetica, Arial, sans-serif', weight: 700, style: 'normal' },
      { name: 'Oblique', family: 'Helvetica, Arial, sans-serif', weight: 400, style: 'italic' },
    ]
  },
  {
    name: 'Georgia',
    family: 'Georgia, serif',
    category: 'serif',
    isPrintingFont: true,
    variants: [
      { name: 'Regular', family: 'Georgia, serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Georgia, serif', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Georgia, serif', weight: 400, style: 'italic' },
      { name: 'Bold Italic', family: 'Georgia, serif', weight: 700, style: 'italic' },
    ]
  },
];

// Дополнительные шрифты (sans-serif)
export const ADDITIONAL_SANS_SERIF_FONTS: FontConfig[] = [
  {
    name: 'Calibri',
    family: 'Calibri, sans-serif',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'Calibri, sans-serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Calibri, sans-serif', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Calibri, sans-serif', weight: 400, style: 'italic' },
    ]
  },
  {
    name: 'Verdana',
    family: 'Verdana, sans-serif',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'Verdana, sans-serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Verdana, sans-serif', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Verdana, sans-serif', weight: 400, style: 'italic' },
    ]
  },
  {
    name: 'Tahoma',
    family: 'Tahoma, sans-serif',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'Tahoma, sans-serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Tahoma, sans-serif', weight: 700, style: 'normal' },
    ]
  },
  {
    name: 'Franklin Gothic',
    family: 'Franklin Gothic Medium, Franklin Gothic, sans-serif',
    category: 'sans-serif',
    variants: [
      { name: 'Book', family: 'Franklin Gothic Book, Franklin Gothic, sans-serif', weight: 400, style: 'normal' },
      { name: 'Medium', family: 'Franklin Gothic Medium, Franklin Gothic, sans-serif', weight: 500, style: 'normal' },
    ]
  },
  {
    name: 'Impact',
    family: 'Impact, sans-serif',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'Impact, sans-serif', weight: 400, style: 'normal' },
    ]
  },
  {
    name: 'Microsoft Sans Serif',
    family: 'Microsoft Sans Serif, sans-serif',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'Microsoft Sans Serif, sans-serif', weight: 400, style: 'normal' },
    ]
  },
  {
    name: 'Candara',
    family: 'Candara, sans-serif',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'Candara, sans-serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Candara, sans-serif', weight: 700, style: 'normal' },
    ]
  },
  {
    name: 'Comic Sans MS',
    family: 'Comic Sans MS, cursive, sans-serif',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'Comic Sans MS, cursive, sans-serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Comic Sans MS, cursive, sans-serif', weight: 700, style: 'normal' },
    ]
  },
  {
    name: 'DejaVu Sans',
    family: 'DejaVu Sans, sans-serif',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'DejaVu Sans, sans-serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'DejaVu Sans, sans-serif', weight: 700, style: 'normal' },
    ]
  },
  {
    name: 'Sylfaen',
    family: 'Sylfaen, serif',
    category: 'serif',
    variants: [
      { name: 'Regular', family: 'Sylfaen, serif', weight: 400, style: 'normal' },
    ]
  },
];

// Дополнительные serif шрифты для штемпельного дела
export const ADDITIONAL_SERIF_FONTS: FontConfig[] = [
  {
    name: 'Cambria',
    family: 'Cambria, serif',
    category: 'serif',
    variants: [
      { name: 'Regular', family: 'Cambria, serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Cambria, serif', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Cambria, serif', weight: 400, style: 'italic' },
    ]
  },
  {
    name: 'Baskerville',
    family: 'Baskerville, serif',
    category: 'serif',
    variants: [
      { name: 'Regular', family: 'Baskerville, serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Baskerville, serif', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Baskerville, serif', weight: 400, style: 'italic' },
    ]
  },
  {
    name: 'Bodoni',
    family: 'Bodoni MT, Bodoni, serif',
    category: 'serif',
    variants: [
      { name: 'Regular', family: 'Bodoni MT, Bodoni, serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Bodoni MT, Bodoni, serif', weight: 700, style: 'normal' },
    ]
  },
  {
    name: 'Didot',
    family: 'Didot, serif',
    category: 'serif',
    variants: [
      { name: 'Regular', family: 'Didot, serif', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Didot, serif', weight: 700, style: 'normal' },
    ]
  },
];

// Специальные декоративные шрифты
export const DECORATIVE_FONTS: FontConfig[] = [
  {
    name: 'Monotype Corsiva',
    family: 'Monotype Corsiva, cursive',
    category: 'serif',
    variants: [
      { name: 'Regular', family: 'Monotype Corsiva, cursive', weight: 400, style: 'italic' },
    ]
  },
];

// Google Fonts (будут загружены динамически)
export const GOOGLE_FONTS: FontConfig[] = [
  {
    name: 'Roboto',
    family: 'Roboto',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'Roboto', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Roboto', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Roboto', weight: 400, style: 'italic' },
    ]
  },
  {
    name: 'Open Sans',
    family: 'Open Sans',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'Open Sans', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Open Sans', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Open Sans', weight: 400, style: 'italic' },
    ]
  },
  {
    name: 'Ubuntu',
    family: 'Ubuntu',
    category: 'sans-serif',
    variants: [
      { name: 'Regular', family: 'Ubuntu', weight: 400, style: 'normal' },
      { name: 'Bold', family: 'Ubuntu', weight: 700, style: 'normal' },
      { name: 'Italic', family: 'Ubuntu', weight: 400, style: 'italic' },
    ]
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

// Вспомогательная функция для получения CSS стилей для варианта шрифта
export const getFontVariantStyle = (variant: { weight?: number | string; style?: 'normal' | 'italic'; stretch?: string }): React.CSSProperties => {
  return {
    fontWeight: variant.weight || 400,
    fontStyle: variant.style || 'normal',
    fontStretch: variant.stretch || 'normal',
  };
};
