import { create } from 'zustand';
import type { StampStore, StampElement } from '../types';
import { DEFAULT_CONFIG } from '../types';

export const useStampStore = create<StampStore>((set, get) => ({
  // Начальное состояние
  elements: [],
  selectedElementId: null,
  canvasSize: DEFAULT_CONFIG.canvasSize,
  history: [[]],
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
}));
