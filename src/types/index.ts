// Типы элементов печати

export type ElementType = 'circle' | 'text' | 'textCentered' | 'triangle' | 'rectangle' | 'line' | 'image' | 'icon';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  visible: boolean;
}

export interface CircleElement extends BaseElement {
  type: 'circle';
  radius: number;
  strokeWidth: number;
  strokeDashArray?: number; // прерывистая обводка
  fill?: string;
  stroke: string;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  curved: boolean; // текст по кругу
  curveRadius?: number; // радиус для текста по кругу
  startAngle?: number; // начальный угол для текста по кругу
  color: string;
  letterSpacing?: number;
  bold?: boolean;
  italic?: boolean;
  flipped?: boolean; // перевернуть текст
}

export interface TextCenteredElement extends BaseElement {
  type: 'textCentered';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold?: boolean;
  italic?: boolean;
  flipped?: boolean; // перевернуть текст
}

export interface RectangleElement extends BaseElement {
  type: 'rectangle';
  width: number;
  height: number;
  fill?: string;
  stroke: string;
  strokeWidth: number;
}

export interface TriangleElement extends BaseElement {
  type: 'triangle';
  size: number;
  fill?: string;
  stroke: string;
  strokeWidth: number;
}

export interface LineElement extends BaseElement {
  type: 'line';
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  width: number;
  height: number;
}

export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string;
  iconSource: 'lucide' | 'heroicons' | 'custom';
  width: number;
  height: number;
  svgContent?: string; // для custom SVG
  fill?: string; // цвет заливки
  stroke?: string; // цвет обводки
  strokeWidth?: number; // толщина обводки
}

export type StampElement =
  | CircleElement
  | TextElement
  | TextCenteredElement
  | RectangleElement
  | TriangleElement
  | LineElement
  | ImageElement
  | IconElement;

// Интерфейс Store
export interface StampStore {
  // Состояние
  elements: StampElement[];
  selectedElementId: string | null;
  canvasSize: number; // размер поля в мм
  history: StampElement[][];
  historyIndex: number;

  // Методы
  addElement: (element: StampElement) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<StampElement>) => void;
  selectElement: (id: string | null) => void;
  getSelectedElement: () => StampElement | null;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // История
  saveToHistory: () => void;

  // Центрирование
  centerElement: (id: string) => void;
}

// Конфигурация шрифтов
export interface FontConfig {
  name: string;
  family: string;
  category: 'serif' | 'sans-serif';
}

// Параметры по умолчанию
export const DEFAULT_CONFIG = {
  canvasSize: 100, // мм
  circleRadius: 39, // мм
  curvedTextRadius: 30.5, // мм - радиус для кривого текста
  fontSize: 6, // мм
  strokeWidth: 1.5, // мм
  strokeColor: '#0000ff',
  textColor: '#0000ff',
  iconFill: '#0000ff', // цвет заливки иконок по умолчанию
  fontFamily: 'Arial, sans-serif', // шрифт по умолчанию
};
