// Типы элементов печати

export type ElementType = 'circle' | 'text' | 'textCentered' | 'triangle' | 'rectangle' | 'line' | 'image' | 'icon' | 'group';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  visible: boolean;
  locked?: boolean; // блокировка редактирования элемента
  parentId?: string; // ID родительской группы для вложенных элементов
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
  letterSpacing?: number;
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
  heightRatio?: number; // коэффициент высоты треугольника
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

export interface GroupElement extends BaseElement {
  type: 'group';
  name: string; // название группы
  children: string[]; // массив ID дочерних элементов
  expanded?: boolean; // состояние раскрытия в UI панели слоёв
  rotation?: number; // поворот группы в градусах
  scaleX?: number; // масштаб по X
  scaleY?: number; // масштаб по Y
}

export type StampElement =
  | CircleElement
  | TextElement
  | TextCenteredElement
  | RectangleElement
  | TriangleElement
  | LineElement
  | ImageElement
  | IconElement
  | GroupElement;

// Интерфейс Store
export interface StampStore {
  // Состояние
  elements: StampElement[];
  selectedElementId: string | null;
  canvasSize: number; // размер поля в мм
  history: StampElement[][];
  historyIndex: number;
  currentProjectId: string | null; // ID текущего открытого проекта
  currentProjectName: string | null; // Название текущего проекта

  // Методы
  addElement: (element: StampElement) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<StampElement>, shouldSaveToHistory?: boolean) => void;
  selectElement: (id: string | null) => void;
  getSelectedElement: () => StampElement | null;

  // Управление порядком элементов (z-index через позицию в массиве)
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  moveToTop: (id: string) => void;
  moveToBottom: (id: string) => void;
  reorderElements: (elementIds: string[]) => void;

  // Группировка элементов
  createGroup: (elementIds: string[], name?: string) => string; // возвращает ID новой группы
  ungroupElements: (groupId: string) => void;
  addToGroup: (groupId: string, elementIds: string[]) => void;
  removeFromGroup: (groupId: string, elementIds: string[]) => void;
  expandGroup: (groupId: string, expanded: boolean) => void;

  // Блокировка элементов
  toggleElementLock: (id: string) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // История
  saveToHistory: () => void;

  // Центрирование
  centerElement: (id: string) => void;

  // Управление проектами
  loadProjectData: (project: { elements: StampElement[]; canvasSize: number; id: string; name: string }) => void;
  setCurrentProject: (id: string | null, name: string | null) => void;
  clearCanvas: () => void;

  // Группировка действий в истории
  isActionInProgress: boolean;
  initialActionState: StampElement[] | null;
  startBatch: () => void;
  endBatch: () => void;
}

// Конфигурация шрифтов Google Fonts
export interface FontConfig {
  name: string; // базовое имя шрифта
  family: string; // базовое CSS family значение
  category: 'serif' | 'sans-serif';
  isPrintingFont?: boolean; // флаг для полиграфических шрифтов
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
  fontFamily: 'Roboto', // шрифт по умолчанию (Google Font)
};
