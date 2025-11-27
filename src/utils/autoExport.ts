import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { vectorizeColoredPNG, type PotraceConfig } from './autoVectorize';

/**
 * Конфигурация автоэкспорта
 */
export interface AutoExportConfig {
  // Имя проекта (для формирования имени ZIP)
  projectName?: string;
  // Размер финального PNG (по умолчанию 4000x4000)
  pngSize?: number;
  // Конфигурация векторизации
  vectorizeConfig?: PotraceConfig;
  // Callback для отслеживания прогресса
  onProgress?: (stage: string, progress: number) => void;
}

/**
 * Результат автоэкспорта
 */
export interface AutoExportResult {
  success: boolean;
  zipBlob?: Blob;
  error?: string;
}

/**
 * Подготовка SVG к экспорту - удаляет элементы редактора
 */
const prepareExportSvg = (svgElement: SVGSVGElement): SVGSVGElement => {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Удаляем все элементы с меткой data-export-exclude
  const editorOnlyElements = clone.querySelectorAll('[data-export-exclude="true"]');
  editorOnlyElements.forEach(el => el.remove());

  return clone;
};

/**
 * Конвертирует Blob в Canvas с возможностью масштабирования
 */
const blobToCanvas = async (blob: Blob, maxSize?: number): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Масштабируем если указан maxSize
      if (maxSize && (width > maxSize || height > maxSize)) {
        const scale = maxSize / Math.max(width, height);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image from blob'));
    };

    img.src = url;
  });
};

/**
 * Генерирует PNG высокого разрешения из SVG
 */
const generateHighResPNG = async (
  svgElement: SVGSVGElement,
  targetSize: number,
  withBackground: boolean
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const svgClone = prepareExportSvg(svgElement);

    // Удаляем белый фон если нужен прозрачный PNG
    if (!withBackground) {
      const firstRect = svgClone.querySelector('rect[fill="white"]');
      if (firstRect) {
        firstRect.remove();
      }
    }

    const svgString = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Рисуем белый фон только если требуется
      if (withBackground) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Рисуем изображение
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG blob'));
          return;
        }
        URL.revokeObjectURL(url);
        resolve(blob);
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG image'));
    };

    img.src = url;
  });
};

/**
 * Генерирует PDF из PNG
 */
const generatePDF = async (pngBlob: Blob, targetSize: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(pngBlob);
    const img = new Image();

    img.onload = () => {
      try {
        // Размеры в мм (A4 и другие стандарты)
        const mmSize = targetSize * 0.264583; // px to mm

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [mmSize, mmSize],
        });

        // Добавляем изображение в PDF
        const imgData = img.src;
        pdf.addImage(imgData, 'PNG', 0, 0, mmSize, mmSize, undefined, 'FAST');

        // Получаем Blob
        const pdfBlob = pdf.output('blob');
        URL.revokeObjectURL(url);
        resolve(pdfBlob);
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load PNG for PDF generation'));
    };

    img.src = url;
  });
};

/**
 * Главная функция автоэкспорта
 * Генерирует все форматы и упаковывает в ZIP
 */
export const autoExportToZIP = async (
  svgElement: SVGSVGElement | null,
  config: AutoExportConfig = {}
): Promise<AutoExportResult> => {
  if (!svgElement) {
    return {
      success: false,
      error: 'SVG element not found',
    };
  }

  const {
    projectName = 'stamp',
    pngSize = 4000,
    vectorizeConfig = {},
    onProgress = () => {},
  } = config;

  try {
    const zip = new JSZip();

    // Этап 1: Генерация PNG с фоном (4000x4000)
    onProgress('Генерация PNG с фоном', 10);
    const pngWithBg = await generateHighResPNG(svgElement, pngSize, true);
    zip.file(`${projectName}.png`, pngWithBg);

    // Этап 2: Генерация PNG с прозрачностью (4000x4000)
    onProgress('Генерация PNG с прозрачностью', 25);
    const pngTransparent = await generateHighResPNG(svgElement, pngSize, false);
    zip.file(`${projectName}-transparent.png`, pngTransparent);

    // Этап 3: Векторизация PNG → SVG через Potrace
    onProgress('Векторизация PNG → SVG', 50);
    // Конвертируем прозрачный PNG в Canvas с уменьшением размера для Potrace
    // Potrace WASM имеет ограничения на размер буфера, используем 1000px
    const pngCanvas = await blobToCanvas(pngTransparent, 1000);
    const vectorizedSVG = await vectorizeColoredPNG(pngCanvas, vectorizeConfig);

    // Сохраняем векторизованный SVG
    zip.file(`${projectName}-vectorized.svg`, vectorizedSVG);

    // Этап 4: Генерация PDF
    onProgress('Генерация PDF', 75);
    const pdfBlob = await generatePDF(pngWithBg, pngSize);
    zip.file(`${projectName}.pdf`, pdfBlob);

    // Этап 5: Добавляем оригинальный SVG (не векторизованный)
    onProgress('Добавление оригинального SVG', 85);
    const svgClone = prepareExportSvg(svgElement);
    if (!svgClone.getAttribute('xmlns')) {
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    const svgString = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    zip.file(`${projectName}-original.svg`, svgBlob);

    // Этап 6: Генерация ZIP
    onProgress('Создание архива ZIP', 95);
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9
      }
    });

    onProgress('Готово!', 100);

    return {
      success: true,
      zipBlob,
    };
  } catch (error) {
    console.error('Ошибка автоэкспорта:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Скачивает ZIP файл с автоэкспортом
 */
export const downloadAutoExport = async (
  svgElement: SVGSVGElement | null,
  config: AutoExportConfig = {}
) => {
  const result = await autoExportToZIP(svgElement, config);

  if (!result.success || !result.zipBlob) {
    alert(`Ошибка экспорта: ${result.error}`);
    return;
  }

  // Скачиваем ZIP
  const projectName = config.projectName || 'stamp';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `${projectName}_export_${timestamp}.zip`;

  const url = URL.createObjectURL(result.zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
