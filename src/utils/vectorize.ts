import ImageTracer from 'imagetracerjs';

/**
 * Качество векторизации
 */
export type VectorizeQuality = 'low' | 'medium' | 'high';

/**
 * Настройки векторизации
 */
export interface VectorizeOptions {
  quality: VectorizeQuality;
  colorCount?: number;
}

/**
 * Пресеты для imagetracer в зависимости от качества
 */
const QUALITY_PRESETS = {
  low: {
    ltres: 2,
    qtres: 2,
    pathomit: 16,
    colorsampling: 1,
    numberofcolors: 8,
    mincolorratio: 0.05,
    colorquantcycles: 2,
  },
  medium: {
    ltres: 1,
    qtres: 1,
    pathomit: 8,
    colorsampling: 2,
    numberofcolors: 16,
    mincolorratio: 0.02,
    colorquantcycles: 3,
  },
  high: {
    ltres: 0.5,
    qtres: 0.5,
    pathomit: 4,
    colorsampling: 2,
    numberofcolors: 32,
    mincolorratio: 0.01,
    colorquantcycles: 5,
  },
};

/**
 * Конвертирует растровое изображение (base64 или URL) в SVG строку
 *
 * @param imageData - Base64 строка изображения или URL
 * @param options - Опции векторизации
 * @returns Promise с SVG строкой
 */
export function vectorizeImage(
  imageData: string,
  options: VectorizeOptions = { quality: 'medium' }
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const preset = QUALITY_PRESETS[options.quality];

      // Если указано количество цветов, переопределяем значение из пресета
      const tracerOptions = {
        ...preset,
        ...(options.colorCount ? { numberofcolors: options.colorCount } : {}),
        desc: false,
        viewbox: false,
        scale: 1,
        roundcoords: 1,
      };

      ImageTracer.imageToSVG(
        imageData,
        (svgString) => {
          if (svgString) {
            resolve(svgString);
          } else {
            reject(new Error('Failed to convert image to SVG'));
          }
        },
        tracerOptions
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Загружает файл изображения и возвращает base64 строку
 */
export function loadImageAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Полный процесс: загрузка файла → векторизация → возврат SVG
 */
export async function vectorizeImageFile(
  file: File,
  options: VectorizeOptions = { quality: 'medium' }
): Promise<string> {
  const base64 = await loadImageAsBase64(file);
  const svg = await vectorizeImage(base64, options);
  return svg;
}

/**
 * Получает примерное количество узлов в SVG (для оценки сложности)
 */
export function getSvgComplexity(svgString: string): number {
  const pathMatches = svgString.match(/<path/g);
  return pathMatches ? pathMatches.length : 0;
}

/**
 * Получает размер SVG строки в КБ
 */
export function getSvgSize(svgString: string): number {
  return new Blob([svgString]).size / 1024;
}
