import type { StampElement, IconElement } from '../types';
import { getCachedSvg } from './extractSvgFromIcon';
import { optimizeSVG } from './svgOptimizer';
import { jsPDF } from 'jspdf';

// Экспорт в PNG
export const exportToPNG = (svgElement: SVGSVGElement | null, filename: string = 'stamp.png') => {
  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  // Клонируем SVG
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  const svgString = new XMLSerializer().serializeToString(svgClone);

  // Создаем Blob из SVG
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Создаем изображение
  const img = new Image();
  img.onload = () => {
    // Рассчитываем размер canvas (4000px по большей стороне)
    const maxSize = 4000;
    const sourceWidth = svgElement.clientWidth;
    const sourceHeight = svgElement.clientHeight;
    const scale = maxSize / Math.max(sourceWidth, sourceHeight);

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(sourceWidth * scale);
    canvas.height = Math.round(sourceHeight * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Белый фон
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем изображение
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Конвертируем в PNG и скачиваем
    canvas.toBlob((blob) => {
      if (!blob) return;
      const pngUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');

    URL.revokeObjectURL(url);
  };

  img.src = url;
};

// Экспорт в PNG без фона (прозрачный фон)
export const exportToPNGTransparent = (svgElement: SVGSVGElement | null, filename: string = 'stamp-transparent.png') => {
  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  // Клонируем SVG
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

  // Удаляем белый фон из SVG (первый rect элемент)
  const firstRect = svgClone.querySelector('rect[fill="white"]');
  if (firstRect) {
    firstRect.remove();
  }

  const svgString = new XMLSerializer().serializeToString(svgClone);

  // Создаем Blob из SVG
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Создаем изображение
  const img = new Image();
  img.onload = () => {
    // Рассчитываем размер canvas (4000px по большей стороне)
    const maxSize = 4000;
    const sourceWidth = svgElement.clientWidth;
    const sourceHeight = svgElement.clientHeight;
    const scale = maxSize / Math.max(sourceWidth, sourceHeight);

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(sourceWidth * scale);
    canvas.height = Math.round(sourceHeight * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // НЕ заполняем фон - оставляем прозрачным

    // Рисуем изображение
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Конвертируем в PNG и скачиваем
    canvas.toBlob((blob) => {
      if (!blob) return;
      const pngUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');

    URL.revokeObjectURL(url);
  };

  img.src = url;
};

// Экспорт в SVG
export const exportToSVG = (svgElement: SVGSVGElement | null, filename: string = 'stamp.svg') => {
  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  // Клонируем SVG
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

  // Добавляем XML namespace если его нет
  if (!svgClone.getAttribute('xmlns')) {
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  // Сериализуем SVG
  const svgString = new XMLSerializer().serializeToString(svgClone);

  // Создаем Blob
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Скачиваем
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

// Экспорт отдельного элемента в SVG
export const exportElementToSVG = async (
  element: StampElement,
  filename?: string
): Promise<void> => {
  try {
    let svgContent = '';
    let width = 100;
    let height = 100;

    // Получаем SVG контент в зависимости от типа элемента
    if (element.type === 'icon') {
      const iconElement = element as IconElement;
      width = iconElement.width;
      height = iconElement.height;

      // Получаем SVG контент
      if (iconElement.iconSource === 'custom' && iconElement.svgContent) {
        svgContent = iconElement.svgContent;
      } else if (iconElement.iconSource === 'lucide') {
        // Для lucide используем getCachedSvg
        const cachedSvg = await getCachedSvg('lucide', iconElement.iconName as any);
        if (cachedSvg) {
          svgContent = cachedSvg;
        } else {
          throw new Error('Не удалось получить SVG контент иконки');
        }
      } else if (iconElement.iconSource === 'heroicons') {
        // Для heroicons используем getCachedSvg
        const cachedSvg = await getCachedSvg('heroicons', iconElement.iconName as any);
        if (cachedSvg) {
          svgContent = cachedSvg;
        } else {
          throw new Error('Не удалось получить SVG контент иконки');
        }
      } else {
        throw new Error('Неизвестный источник иконки');
      }

      // Применяем стили если они заданы
      if (iconElement.fill || iconElement.stroke) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');

        if (svgEl) {
          // Применяем fill ко всем path элементам
          if (iconElement.fill) {
            const paths = svgEl.querySelectorAll('path, circle, rect, polygon');
            paths.forEach((path) => {
              path.setAttribute('fill', iconElement.fill!);
            });
          }

          // Применяем stroke
          if (iconElement.stroke) {
            const paths = svgEl.querySelectorAll('path, circle, rect, polygon');
            paths.forEach((path) => {
              path.setAttribute('stroke', iconElement.stroke!);
              if (iconElement.strokeWidth) {
                path.setAttribute('stroke-width', String(iconElement.strokeWidth));
              }
            });
          }

          svgContent = new XMLSerializer().serializeToString(svgEl);
        }
      }
    } else if (element.type === 'circle') {
      // Экспорт круга
      width = element.radius * 2;
      height = element.radius * 2;
      svgContent = `
        <circle
          cx="${element.radius}"
          cy="${element.radius}"
          r="${element.radius}"
          fill="${element.fill || 'none'}"
          stroke="${element.stroke}"
          stroke-width="${element.strokeWidth}"
        />
      `;
    } else if (element.type === 'rectangle') {
      // Экспорт прямоугольника
      width = element.width;
      height = element.height;
      svgContent = `
        <rect
          width="${element.width}"
          height="${element.height}"
          fill="${element.fill || 'none'}"
          stroke="${element.stroke}"
          stroke-width="${element.strokeWidth}"
        />
      `;
    } else {
      throw new Error(`Экспорт элемента типа "${element.type}" пока не поддерживается`);
    }

    // Создаём standalone SVG
    const standaloneSvg = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="${width}"
        height="${height}"
        viewBox="0 0 ${width} ${height}"
      >
        ${svgContent}
      </svg>
    `;

    // Оптимизируем SVG
    const optimizedSvg = await optimizeSVG(standaloneSvg, {
      precision: 2,
      removeComments: true,
      removeMetadata: true,
    });

    // Создаём имя файла
    const defaultFilename =
      element.type === 'icon' ? `icon-${(element as IconElement).iconName}.svg` :
      element.type === 'circle' ? 'circle.svg' :
      element.type === 'rectangle' ? 'rectangle.svg' :
      'element.svg';

    const finalFilename = filename || defaultFilename;

    // Скачиваем файл
    const blob = new Blob([optimizedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting element to SVG:', error);
    throw error;
  }
};

// Экспорт в PDF
export const exportToPDF = (svgElement: SVGSVGElement | null, filename: string = 'stamp.pdf') => {
  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  // Клонируем SVG
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  const svgString = new XMLSerializer().serializeToString(svgClone);

  // Создаем Blob из SVG
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Создаем изображение
  const img = new Image();
  img.onload = () => {
    // Рассчитываем размер canvas (500px по большей стороне для PDF)
    const maxSize = 500;
    const sourceWidth = svgElement.clientWidth;
    const sourceHeight = svgElement.clientHeight;
    const scale = maxSize / Math.max(sourceWidth, sourceHeight);

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(sourceWidth * scale);
    canvas.height = Math.round(sourceHeight * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Белый фон
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем изображение
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Конвертируем canvas в изображение для PDF
    const imgData = canvas.toDataURL('image/png');

    // Создаем PDF
    // Размеры в мм (используем оригинальные размеры canvas для соотношения сторон)
    const imgWidth = sourceWidth * 0.264583; // px to mm
    const imgHeight = sourceHeight * 0.264583; // px to mm

    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [imgWidth, imgHeight],
    });

    // Добавляем изображение в PDF с высоким разрешением
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Сохраняем PDF
    pdf.save(filename);

    URL.revokeObjectURL(url);
  };

  img.src = url;
};
