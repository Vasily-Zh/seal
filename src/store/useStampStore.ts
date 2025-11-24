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
  currentProjectId: null,
  currentProjectName: null,

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

  // Дублирование элемента
  duplicateElement: (id: string) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      // Создаём копию с новым id и небольшим смещением
      const duplicatedElement: StampElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: element.x + 2,
        y: element.y + 2,
        // Если это группа, не копируем children (дублируем только простые элементы)
        ...(element.type === 'group' ? { children: [] } : {}),
      };

      return {
        elements: [...state.elements, duplicatedElement],
        selectedElementId: duplicatedElement.id,
      };
    });
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

  // Управление порядком элементов (z-index через позицию в массиве)
  moveElementUp: (id: string) => {
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      if (index === -1 || index === state.elements.length - 1) return state;

      const newElements = [...state.elements];
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];

      return { elements: newElements };
    });
    get().saveToHistory();
  },

  moveElementDown: (id: string) => {
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      if (index <= 0) return state;

      const newElements = [...state.elements];
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];

      return { elements: newElements };
    });
    get().saveToHistory();
  },

  moveToTop: (id: string) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      const newElements = state.elements.filter((el) => el.id !== id);
      newElements.push(element);

      return { elements: newElements };
    });
    get().saveToHistory();
  },

  moveToBottom: (id: string) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      const newElements = state.elements.filter((el) => el.id !== id);
      newElements.unshift(element);

      return { elements: newElements };
    });
    get().saveToHistory();
  },

  reorderElements: (elementIds: string[]) => {
    set((state) => {
      // Создаём Map для быстрого доступа к элементам
      const elementsMap = new Map(state.elements.map((el) => [el.id, el]));

      // Создаём новый массив в порядке elementIds
      const newElements = elementIds
        .map((id) => elementsMap.get(id))
        .filter((el): el is StampElement => el !== undefined);

      // Если количество элементов изменилось, возвращаем старое состояние
      if (newElements.length !== state.elements.length) return state;

      return { elements: newElements };
    });
    get().saveToHistory();
  },

  // Группировка элементов
  createGroup: (elementIds: string[], name?: string) => {
    const state = get();
    const groupId = `group-${Date.now()}`;

    // Проверяем, что все элементы существуют
    const elementsToGroup = state.elements.filter((el) => elementIds.includes(el.id));
    if (elementsToGroup.length === 0) return groupId;

    // Вычисляем центр группы
    const avgX = elementsToGroup.reduce((sum, el) => sum + el.x, 0) / elementsToGroup.length;
    const avgY = elementsToGroup.reduce((sum, el) => sum + el.y, 0) / elementsToGroup.length;

    // Создаём группу
    const group: StampElement = {
      id: groupId,
      type: 'group',
      name: name || `Группа ${new Date().toLocaleTimeString()}`,
      children: elementIds,
      expanded: true,
      x: avgX,
      y: avgY,
      visible: true,
    };

    set((state) => ({
      elements: [
        // Обновляем parentId у всех элементов группы
        ...state.elements.map((el) =>
          elementIds.includes(el.id)
            ? ({ ...el, parentId: groupId } as StampElement)
            : el
        ),
        // Добавляем группу в конец
        group,
      ],
      selectedElementId: groupId,
    }));
    get().saveToHistory();

    return groupId;
  },

  ungroupElements: (groupId: string) => {
    set((state) => {
      const group = state.elements.find((el) => el.id === groupId);
      if (!group || group.type !== 'group') return state;

      return {
        elements: state.elements
          // Удаляем группу
          .filter((el) => el.id !== groupId)
          // Убираем parentId у дочерних элементов
          .map((el) =>
            group.children.includes(el.id)
              ? ({ ...el, parentId: undefined } as StampElement)
              : el
          ),
        selectedElementId: null,
      };
    });
    get().saveToHistory();
  },

  addToGroup: (groupId: string, elementIds: string[]) => {
    set((state) => {
      const group = state.elements.find((el) => el.id === groupId);
      if (!group || group.type !== 'group') return state;

      // Обновляем группу и элементы
      return {
        elements: state.elements.map((el) => {
          if (el.id === groupId && el.type === 'group') {
            return {
              ...el,
              children: [...new Set([...el.children, ...elementIds])],
            } as StampElement;
          }
          if (elementIds.includes(el.id)) {
            return { ...el, parentId: groupId } as StampElement;
          }
          return el;
        }),
      };
    });
    get().saveToHistory();
  },

  removeFromGroup: (groupId: string, elementIds: string[]) => {
    set((state) => {
      const group = state.elements.find((el) => el.id === groupId);
      if (!group || group.type !== 'group') return state;

      return {
        elements: state.elements.map((el) => {
          if (el.id === groupId && el.type === 'group') {
            return {
              ...el,
              children: el.children.filter((id) => !elementIds.includes(id)),
            } as StampElement;
          }
          if (elementIds.includes(el.id)) {
            return { ...el, parentId: undefined } as StampElement;
          }
          return el;
        }),
      };
    });
    get().saveToHistory();
  },

  expandGroup: (groupId: string, expanded: boolean) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === groupId && el.type === 'group'
          ? ({ ...el, expanded } as StampElement)
          : el
      ),
    }));
    // Не сохраняем в историю - это только UI состояние
  },

  // Блокировка элементов
  toggleElementLock: (id: string) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, locked: !el.locked } as StampElement) : el
      ),
    }));
    get().saveToHistory();
  },

  // Управление проектами
  loadProjectData: (project) => {
    set({
      elements: project.elements,
      canvasSize: project.canvasSize,
      currentProjectId: project.id,
      currentProjectName: project.name,
      selectedElementId: null,
      history: [project.elements],
      historyIndex: 0,
    });
  },

  setCurrentProject: (id, name) => {
    set({
      currentProjectId: id,
      currentProjectName: name,
    });
  },

  clearCanvas: () => {
    set({
      elements: [],
      selectedElementId: null,
      currentProjectId: null,
      currentProjectName: null,
      history: [[]],
      historyIndex: 0,
    });
  },
}));
