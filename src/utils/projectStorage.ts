import type { StampElement } from '../types';

export interface StampProject {
  id: string;
  name: string;
  canvasSize: number;
  elements: StampElement[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string; // base64 превью
}

interface ProjectMetadata {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

const PROJECTS_KEY = 'stamp-projects';
const PROJECT_DATA_PREFIX = 'stamp-project-';

// Получить список всех проектов (только метаданные)
export function listProjects(): ProjectMetadata[] {
  try {
    const projectsJson = localStorage.getItem(PROJECTS_KEY);
    if (!projectsJson) return [];

    const projects: ProjectMetadata[] = JSON.parse(projectsJson);
    return projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.error('Error loading projects list:', error);
    return [];
  }
}

// Получить полный проект по ID
export function loadProject(projectId: string): StampProject | null {
  try {
    const projectJson = localStorage.getItem(`${PROJECT_DATA_PREFIX}${projectId}`);
    if (!projectJson) return null;

    const project: StampProject = JSON.parse(projectJson);
    return project;
  } catch (error) {
    console.error('Error loading project:', error);
    return null;
  }
}

// Сохранить проект
export function saveProject(
  name: string,
  elements: StampElement[],
  canvasSize: number,
  projectId?: string,
  thumbnail?: string
): string {
  try {
    const id = projectId || `project-${Date.now()}`;
    const now = new Date().toISOString();

    const project: StampProject = {
      id,
      name,
      canvasSize,
      elements,
      createdAt: projectId ? (loadProject(projectId)?.createdAt || now) : now,
      updatedAt: now,
      thumbnail,
    };

    // Сохраняем полные данные проекта
    localStorage.setItem(`${PROJECT_DATA_PREFIX}${id}`, JSON.stringify(project));

    // Обновляем метаданные
    const projectsList = listProjects();
    const existingIndex = projectsList.findIndex((p) => p.id === id);

    const metadata: ProjectMetadata = {
      id,
      name,
      createdAt: project.createdAt,
      updatedAt: now,
      thumbnail,
    };

    if (existingIndex >= 0) {
      projectsList[existingIndex] = metadata;
    } else {
      projectsList.push(metadata);
    }

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projectsList));

    return id;
  } catch (error) {
    console.error('Error saving project:', error);
    throw new Error('Не удалось сохранить проект. Возможно, недостаточно места в localStorage.');
  }
}

// Удалить проект
export function deleteProject(projectId: string): void {
  try {
    // Удаляем данные проекта
    localStorage.removeItem(`${PROJECT_DATA_PREFIX}${projectId}`);

    // Удаляем из списка метаданных
    const projectsList = listProjects();
    const filtered = projectsList.filter((p) => p.id !== projectId);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Не удалось удалить проект.');
  }
}

// Экспортировать проект как JSON файл
export function exportProjectAsJSON(projectId: string): void {
  const project = loadProject(projectId);
  if (!project) {
    throw new Error('Проект не найден');
  }

  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.name.replace(/[^a-zа-я0-9]/gi, '_')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Импортировать проект из JSON файла
export function importProjectFromJSON(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const project: StampProject = JSON.parse(json);

        // Валидация структуры проекта
        if (!project.name || !Array.isArray(project.elements) || !project.canvasSize) {
          throw new Error('Неверный формат файла проекта');
        }

        // Генерируем новый ID для импортированного проекта
        const newId = `project-${Date.now()}`;

        // Сохраняем проект
        const savedId = saveProject(
          `${project.name} (импортирован)`,
          project.elements,
          project.canvasSize,
          newId,
          project.thumbnail
        );

        resolve(savedId);
      } catch (error) {
        console.error('Error importing project:', error);
        reject(new Error('Не удалось импортировать проект. Проверьте формат файла.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл.'));
    };

    reader.readAsText(file);
  });
}

// Создать превью проекта (thumbnail)
export function generateThumbnail(svgElement: SVGSVGElement): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Клонируем SVG элемент
      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

      // Сериализуем в строку
      const svgString = new XMLSerializer().serializeToString(clonedSvg);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      // Создаем image для рендеринга
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Не удалось создать canvas context'));
          return;
        }

        // Размер превью 200x200px
        const size = 200;
        canvas.width = size;
        canvas.height = size;

        // Белый фон
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // Рисуем изображение
        ctx.drawImage(img, 0, 0, size, size);

        // Конвертируем в base64
        const dataUrl = canvas.toDataURL('image/png');

        URL.revokeObjectURL(url);
        resolve(dataUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Не удалось создать превью'));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

// Получить размер используемого localStorage в MB
export function getStorageSize(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total / (1024 * 1024); // В мегабайтах
}

// Проверить доступное место в localStorage
export function checkStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    const testValue = 'x'.repeat(1024 * 1024); // 1MB
    localStorage.setItem(testKey, testValue);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}
