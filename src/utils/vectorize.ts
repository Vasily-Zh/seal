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
 * Получает размеры изображения (ширину и высоту в пикселях)
 */
export function getImageDimensions(imageSrc: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageSrc;
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

/**
 * Вычисляет bounding box SVG содержимого
 */
function calculateSvgBoundingBox(svgElement: Element): { x: number; y: number; width: number; height: number } | null {
  try {
    const elements = svgElement.querySelectorAll('path, circle, rect, polygon, polyline, ellipse, line, text, image');

    if (elements.length === 0) {
      return null;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach((el) => {
      try {
        // Используем getBBox если доступен (работает с SVGElement)
        if ('getBBox' in el && typeof (el as any).getBBox === 'function') {
          try {
            const bbox = (el as any).getBBox();
            minX = Math.min(minX, bbox.x);
            minY = Math.min(minY, bbox.y);
            maxX = Math.max(maxX, bbox.x + bbox.width);
            maxY = Math.max(maxY, bbox.y + bbox.height);
          } catch (e) {
            // getBBox может не работать в некоторых случаях
          }
        }

        // Для path элементов пытаемся парсить координаты
        if (el.tagName === 'path') {
          const d = el.getAttribute('d');
          if (d) {
            const coords = d.match(/[\d.]+/g);
            if (coords) {
              for (let i = 0; i < coords.length; i += 2) {
                const x = parseFloat(coords[i]);
                const y = parseFloat(coords[i + 1]);
                if (!isNaN(x)) minX = Math.min(minX, x);
                if (!isNaN(y)) minY = Math.min(minY, y);
                if (!isNaN(x)) maxX = Math.max(maxX, x);
                if (!isNaN(y)) maxY = Math.max(maxY, y);
              }
            }
          }
        }

        // Для rect элементов
        if (el.tagName === 'rect') {
          const x = parseFloat(el.getAttribute('x') || '0');
          const y = parseFloat(el.getAttribute('y') || '0');
          const w = parseFloat(el.getAttribute('width') || '0');
          const h = parseFloat(el.getAttribute('height') || '0');
          if (!isNaN(x)) minX = Math.min(minX, x);
          if (!isNaN(y)) minY = Math.min(minY, y);
          if (!isNaN(x) && !isNaN(w)) maxX = Math.max(maxX, x + w);
          if (!isNaN(y) && !isNaN(h)) maxY = Math.max(maxY, y + h);
        }

        // Для circle элементов
        if (el.tagName === 'circle') {
          const cx = parseFloat(el.getAttribute('cx') || '0');
          const cy = parseFloat(el.getAttribute('cy') || '0');
          const r = parseFloat(el.getAttribute('r') || '0');
          if (!isNaN(cx) && !isNaN(r)) {
            minX = Math.min(minX, cx - r);
            maxX = Math.max(maxX, cx + r);
          }
          if (!isNaN(cy) && !isNaN(r)) {
            minY = Math.min(minY, cy - r);
            maxY = Math.max(maxY, cy + r);
          }
        }
      } catch (e) {
        // Игнорируем ошибки при расчете для отдельных элементов
      }
    });

    if (isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY)) {
      const width = maxX - minX;
      const height = maxY - minY;

      // Добавляем небольшой padding для уверенности
      const padding = Math.max(width, height) * 0.05;

      return {
        x: minX - padding,
        y: minY - padding,
        width: width + padding * 2,
        height: height + padding * 2,
      };
    }

    return null;
  } catch (error) {
    console.error('Error calculating bounding box:', error);
    return null;
  }
}

/**
 * Нормализует SVG из imagetracer:
 * - Добавляет правильный viewBox на основе bounding box содержимого
 * - Убирает лишние атрибуты
 * - Гарантирует правильное масштабирование
 */
export function normalizeSvgFromImageTracer(svgString: string | any): string {
  try {
    // Убеждаемся что это строка
    const svgStr = typeof svgString === 'string' ? svgString : String(svgString);
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStr, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      return svgString;
    }

    // Получаем текущие размеры
    let width = svgElement.getAttribute('width');
    let height = svgElement.getAttribute('height');
    const viewBox = svgElement.getAttribute('viewBox');

    // Сначала пытаемся вычислить правильный bounding box на основе содержимого
    const bbox = calculateSvgBoundingBox(svgElement);

    if (bbox && bbox.width > 0 && bbox.height > 0) {
      // Используем bounding box для установки viewBox
      svgElement.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
    } else if (viewBox) {
      // Если bounding box не получилось, используем существующий viewBox
      // Убеждаемся что он правильный
      const parts = viewBox.split(' ');
      if (parts.length === 4) {
        width = parts[2];
        height = parts[3];
      }
    } else if (width && height) {
      // Если нет viewBox но есть width/height, используем их
      const w = parseFloat(width);
      const h = parseFloat(height);
      if (w > 0 && h > 0) {
        svgElement.setAttribute('viewBox', `0 0 ${w} ${h}`);
      }
    }

    // Устанавливаем width и height в 100% для правильного масштабирования
    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');

    // Убираем лишние атрибуты которые могут интерферировать
    svgElement.removeAttribute('xmlns:xlink');

    return new XMLSerializer().serializeToString(svgElement);
  } catch (error) {
    console.error('Error normalizing SVG:', error);
    return svgString;
  }
}

/**
 * Настройки для Potrace векторизации
 */
export interface PotraceOptions {
  threshold?: number; // Порог для черно-белой конвертации (0-255, по умолчанию 128)
  turdSize?: number; // Размер для фильтрации мелких деталей (по умолчанию 2)
  optCurve?: boolean; // Оптимизировать кривые (по умолчанию true)
  color?: string; // Цвет для SVG (по умолчанию '#000000')
}

/**
 * Конвертирует изображение в монохромный SVG используя Potrace WASM
 * Лучше всего работает с черно-белыми логотипами
 *
 * @param imageData - Base64 строка изображения или URL
 * @param options - Опции векторизации Potrace
 * @returns Promise с SVG строкой
 */
export async function vectorizeWithPotrace(
  imageData: string,
  options: PotraceOptions = {}
): Promise<string> {
  const {
    threshold = 128,
    turdSize = 2,
    optCurve = true,
    color = '#000000',
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // Создаём изображение для обработки
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = async () => {
        try {
          // Создаём canvas для конвертации изображения в черно-белое
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Рисуем изображение
          ctx.drawImage(img, 0, 0);

          // Получаем данные пикселей
          const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageDataObj.data;

          // Конвертируем в черно-белое используя порог
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Вычисляем яркость (grayscale)
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            // Применяем порог
            const bw = brightness >= threshold ? 255 : 0;

            pixels[i] = bw;
            pixels[i + 1] = bw;
            pixels[i + 2] = bw;
          }

          // Возвращаем обработанное изображение на canvas
          ctx.putImageData(imageDataObj, 0, 0);

          // Импортируем Potrace динамически
          import('potrace-wasm')
            .then(async (potraceModule) => {
              try {
                const { loadImage, posterize } = potraceModule;

                // Конвертируем canvas в Blob
                canvas.toBlob(async (blob) => {
                  if (!blob) {
                    reject(new Error('Failed to convert canvas to blob'));
                    return;
                  }

                  try {
                    // Загружаем изображение в Potrace
                    const imageBuffer = await blob.arrayBuffer();
                    const potraceImage = await loadImage(new Uint8Array(imageBuffer));

                    // Выполняем векторизацию
                    const svg = await posterize(potraceImage, {
                      threshold,
                      turdSize,
                      optCurve,
                      color,
                    });

                    // Добавляем xmlns если его нет
                    let svgString = svg;
                    if (!svgString.includes('xmlns')) {
                      svgString = svgString.replace(
                        '<svg',
                        '<svg xmlns="http://www.w3.org/2000/svg"'
                      );
                    }

                    resolve(svgString);
                  } catch (error) {
                    reject(new Error(`Potrace vectorization failed: ${error}`));
                  }
                }, 'image/png');
              } catch (error) {
                reject(new Error(`Potrace module error: ${error}`));
              }
            })
            .catch((error) => {
              reject(new Error(`Failed to load Potrace module: ${error}`));
            });
        } catch (error) {
          reject(new Error(`Image processing error: ${error}`));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = imageData;
    } catch (error) {
      reject(new Error(`Potrace initialization error: ${error}`));
    }
  });
}

/**
 * Определяет, подходит ли изображение для Potrace (черно-белое)
 * Возвращает true если изображение в основном черно-белое
 */
export async function isImageSuitableForPotrace(imageData: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(img.width, 200); // Для производительности
        canvas.height = Math.min(img.height, 200);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(false);
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageDataObj.data;

        // Подсчитываем количество уникальных цветов
        const colors = new Set<string>();
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          colors.add(`${r},${g},${b}`);

          // Если цветов слишком много, сразу возвращаем false
          if (colors.size > 16) {
            resolve(false);
                return;
              }
            }

        // Изображение подходит если у него мало цветов
        resolve(colors.size <= 8);
      } catch (error) {
        resolve(false);
      }
    };

    img.onerror = () => {
      resolve(false);
    };

    img.src = imageData;
  });
}
