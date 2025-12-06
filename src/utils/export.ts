import type { StampElement, IconElement } from '../types';
import { getCachedSvg } from './extractSvgFromIcon';
import { optimizeSVG } from './svgOptimizer';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

// Helper для подготовки SVG к экспорту - удаляет элементы редактора
const prepareExportSvg = (svgElement: SVGSVGElement): SVGSVGElement => {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Удаляем все элементы с меткой data-export-exclude
  const editorOnlyElements = clone.querySelectorAll('[data-export-exclude="true"]');
  editorOnlyElements.forEach(el => el.remove());

  return clone;
};

// Экспорт в PNG
export const exportToPNG = (svgElement: SVGSVGElement | null, filename: string = 'stamp.png') => {
  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  // Клонируем SVG и удаляем элементы редактора
  const svgClone = prepareExportSvg(svgElement);
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

    // Проверяем iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // На iOS используем data URL
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Конвертируем в PNG и скачиваем через blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
      }, 'image/png');
    }

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

  // Клонируем SVG и удаляем элементы редактора
  const svgClone = prepareExportSvg(svgElement);

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

    // Проверяем iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // На iOS используем data URL
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Конвертируем в PNG и скачиваем через blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
      }, 'image/png');
    }

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

  // Клонируем SVG и удаляем элементы редактора
  const svgClone = prepareExportSvg(svgElement);

  // Добавляем XML namespace если его нет
  if (!svgClone.getAttribute('xmlns')) {
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  // Сериализуем SVG
  const svgString = new XMLSerializer().serializeToString(svgClone);

  // Проверяем iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS) {
    // На iOS используем data URL
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Создаем Blob
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Скачиваем
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
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

  // Клонируем SVG и удаляем элементы редактора
  const svgClone = prepareExportSvg(svgElement);
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

// Экспорт всех форматов в ZIP архив
export const exportToZIP = async (svgElement: SVGSVGElement | null, filename: string = 'stamp.zip') => {
  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  const zip = new JSZip();

  // Клонируем SVG для разных экспортов и удаляем элементы редактора
  const svgClone = prepareExportSvg(svgElement);
  const svgString = new XMLSerializer().serializeToString(svgClone);

  // Создаем Blob из SVG
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Создаем изображение
  const img = new Image();

  return new Promise<void>((resolve, reject) => {
    img.onload = async () => {
      try {
        const maxSize = 4000;
        const sourceWidth = svgElement.clientWidth;
        const sourceHeight = svgElement.clientHeight;
        const scale = maxSize / Math.max(sourceWidth, sourceHeight);

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(sourceWidth * scale);
        canvas.height = Math.round(sourceHeight * scale);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // 1. PNG с белым фоном
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngBlob = await new Promise<Blob>((res) => {
          canvas.toBlob((b) => res(b!), 'image/png');
        });
        zip.file('stamp.png', pngBlob);

        // 2. PNG без фона (прозрачный)
        const svgCloneTransparent = prepareExportSvg(svgElement);
        const firstRect = svgCloneTransparent.querySelector('rect[fill="white"]');
        if (firstRect) firstRect.remove();
        const svgStringTransparent = new XMLSerializer().serializeToString(svgCloneTransparent);
        const blobTransparent = new Blob([svgStringTransparent], { type: 'image/svg+xml;charset=utf-8' });
        const urlTransparent = URL.createObjectURL(blobTransparent);

        const imgTransparent = new Image();
        await new Promise<void>((res) => {
          imgTransparent.onload = () => res();
          imgTransparent.src = urlTransparent;
        });

        const canvasTransparent = document.createElement('canvas');
        canvasTransparent.width = Math.round(sourceWidth * scale);
        canvasTransparent.height = Math.round(sourceHeight * scale);
        const ctxTransparent = canvasTransparent.getContext('2d');
        if (ctxTransparent) {
          ctxTransparent.drawImage(imgTransparent, 0, 0, canvasTransparent.width, canvasTransparent.height);
          const pngTransparentBlob = await new Promise<Blob>((res) => {
            canvasTransparent.toBlob((b) => res(b!), 'image/png');
          });
          zip.file('stamp-transparent.png', pngTransparentBlob);
        }
        URL.revokeObjectURL(urlTransparent);

        // 3. PDF
        const pdfCanvas = document.createElement('canvas');
        const pdfScale = 500 / Math.max(sourceWidth, sourceHeight);
        pdfCanvas.width = Math.round(sourceWidth * pdfScale);
        pdfCanvas.height = Math.round(sourceHeight * pdfScale);
        const pdfCtx = pdfCanvas.getContext('2d');
        if (pdfCtx) {
          pdfCtx.fillStyle = 'white';
          pdfCtx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
          pdfCtx.drawImage(img, 0, 0, pdfCanvas.width, pdfCanvas.height);
          const imgData = pdfCanvas.toDataURL('image/png');

          const imgWidth = sourceWidth * 0.264583;
          const imgHeight = sourceHeight * 0.264583;
          const pdf = new jsPDF({
            orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
            unit: 'mm',
            format: [imgWidth, imgHeight],
          });
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          const pdfBlob = pdf.output('blob');
          zip.file('stamp.pdf', pdfBlob);
        }

        // 4. SVG
        const svgCloneFinal = prepareExportSvg(svgElement);
        if (!svgCloneFinal.getAttribute('xmlns')) {
          svgCloneFinal.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        const svgStringFinal = new XMLSerializer().serializeToString(svgCloneFinal);
        const svgBlob = new Blob([svgStringFinal], { type: 'image/svg+xml;charset=utf-8' });
        zip.file('stamp.svg', svgBlob);

        // Генерируем и скачиваем ZIP
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        // Проверяем iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        if (isIOS) {
          // На iOS Safari не поддерживает скачивание ZIP через blob
          // Скачиваем PNG напрямую через data URL
          const pngDataUrl = canvas.toDataURL('image/png');
          
          // Создаем ссылку на PNG
          const link = document.createElement('a');
          link.href = pngDataUrl;
          link.download = 'stamp.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Показываем понятное сообщение
          setTimeout(() => {
            alert('PNG файл скачан!\n\nДля скачивания других форматов (PNG без фона, SVG, PDF) выберите их отдельно в меню "Скачать".');
          }, 300);
        } else {
          const zipUrl = URL.createObjectURL(zipBlob);
          const link = document.createElement('a');
          link.href = zipUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Очищаем URL через некоторое время
          setTimeout(() => {
            URL.revokeObjectURL(zipUrl);
          }, 10000);
        }
        
        URL.revokeObjectURL(url);

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};
