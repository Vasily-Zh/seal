import { create } from 'zustand';
import type { StampStore, StampElement } from '../types';
import { DEFAULT_CONFIG } from '../types';

// Начальные элементы по умолчанию
const initialElements: StampElement[] = [
  // Круг внешний
  {
    id: 'circle-default',
    type: 'circle',
    x: 50,
    y: 50,
    radius: 39,
    strokeWidth: 1.5,
    stroke: '#0000ff',
    visible: true,
  },
  // Текст по кругу (верхний)
  {
    id: 'text-default-1',
    type: 'text',
    text: 'ПРИМЕР ТЕКСТА ПО КРУГУ',
    x: 50,
    y: 50,
    fontSize: 6,
    fontFamily: 'Arial, sans-serif',
    curved: true,
    curveRadius: 33.5,
    startAngle: 270,
    letterSpacing: 0,
    color: '#0000ff',
    flipped: true,
    bold: false,
    italic: false,
    visible: true,
  },
  // Текст по кругу (нижний)
  {
    id: 'text-default-2',
    type: 'text',
    text: 'ПРИМЕР ТЕКСТА ПО КРУГУ',
    x: 50,
    y: 50,
    fontSize: 6,
    fontFamily: 'Arial, sans-serif',
    curved: true,
    curveRadius: 30.5,
    startAngle: 90,
    letterSpacing: 0,
    color: '#0000ff',
    flipped: false,
    bold: false,
    italic: false,
    visible: true,
  },
  // Круг внутренний
  {
    id: 'circle-default-2',
    type: 'circle',
    x: 50,
    y: 50,
    radius: 37,
    strokeWidth: 1,
    stroke: '#0000ff',
    visible: true,
  },
];

export const useStampStore = create<StampStore>((set, get) => ({
  // Начальное состояние
  elements: initialElements,
  selectedElementId: null,
  canvasSize: DEFAULT_CONFIG.canvasSize,
  history: [initialElements],
  historyIndex: 0,

  // Добавление элемента
  addElement: (element: StampElement) => {
    set((state) => {
      const newElements = [...state.elements, element];
      return {
        elements: newElements,
        selectedElementId: element.id,
      };
    });
    get().saveToHistory();
  },

  // Удаление элемента
  removeElement: (id: string) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    }));
    get().saveToHistory();
  },

  // Обновление элемента
  updateElement: (id: string, updates: Partial<StampElement>) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, ...updates } as StampElement) : el
      ),
    }));
    get().saveToHistory();
  },

  // Выбор элемента
  selectElement: (id: string | null) => {
    set({ selectedElementId: id });
  },

  // Получить выбранный элемент
  getSelectedElement: () => {
    const state = get();
    if (!state.selectedElementId) return null;
    return state.elements.find((el) => el.id === state.selectedElementId) || null;
  },

  // Сохранение в историю
  saveToHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.elements]);

      // Ограничиваем историю до 50 шагов
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  // Отмена (Undo)
  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          elements: [...state.history[newIndex]],
          historyIndex: newIndex,
          selectedElementId: null,
        };
      }
      return state;
    });
  },

  // Возврат (Redo)
  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          elements: [...state.history[newIndex]],
          historyIndex: newIndex,
          selectedElementId: null,
        };
      }
      return state;
    });
  },

  // Проверка возможности отмены
  canUndo: () => {
    const state = get();
    return state.historyIndex > 0;
  },

  // Проверка возможности возврата
  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },

  // Центрирование элемента
  centerElement: (id: string) => {
    const state = get();
    const centerX = state.canvasSize / 2;
    const centerY = state.canvasSize / 2;

    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, x: centerX, y: centerY } as StampElement) : el
      ),
    }));
    get().saveToHistory();
  },
}));
