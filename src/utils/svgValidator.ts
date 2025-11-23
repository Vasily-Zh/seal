/**
 * Утилиты для валидации, минификации и обработки SVG-файлов
 */

export interface SVGValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Валидация SVG-файла
 */
export function validateSVG(svgContent: string): SVGValidationResult {
  const warnings: string[] = [];

  // Проверка на пустой контент
  if (!svgContent || svgContent.trim() === '') {
    return { isValid: false, error: 'SVG контент пустой' };
  }

  // Проверка на наличие <svg> тега
  if (!svgContent.includes('<svg')) {
    return { isValid: false, error: 'Файл не содержит SVG тега' };
  }

  // Проверка на корректность XML (базовая)
  const svgTagMatch = svgContent.match(/<svg[^>]*>/);
  if (!svgTagMatch) {
    return { isValid: false, error: 'Некорректный SVG тег' };
  }

  // Проверка на наличие закрывающего тега
  if (!svgContent.includes('</svg>')) {
    return { isValid: false, error: 'Отсутствует закрывающий тег </svg>' };
  }

  // Проверка размера (предупреждение если > 500 КБ)
  const sizeInKB = new Blob([svgContent]).size / 1024;
  if (sizeInKB > 500) {
    warnings.push(`Большой размер файла: ${sizeInKB.toFixed(2)} КБ. Рекомендуется оптимизация.`);
  }

  // Проверка на наличие inline стилей (предупреждение)
  if (svgContent.includes('style=') || svgContent.includes('<style')) {
    warnings.push(
      'SVG содержит inline стили. Это может мешать кастомизации цветов через fill/stroke.'
    );
  }

  // Проверка на наличие скриптов (безопасность)
  if (svgContent.includes('<script')) {
    return { isValid: false, error: 'SVG содержит скрипты. Это запрещено по соображениям безопасности.' };
  }

  // Проверка на наличие внешних ссылок
  if (svgContent.includes('xmlns:xlink') && svgContent.includes('xlink:href')) {
    warnings.push('SVG содержит внешние ссылки (xlink:href). Убедитесь, что они корректны.');
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Минификация SVG (удаление пробелов, переносов строк, комментариев)
 */
export function minifySVG(svgContent: string): string {
  let minified = svgContent;

  // Удаление XML комментариев
  minified = minified.replace(/<!--[\s\S]*?-->/g, '');

  // Удаление DOCTYPE
  minified = minified.replace(/<!DOCTYPE[^>]*>/gi, '');

  // Удаление переносов строк и лишних пробелов
  minified = minified
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Удаление пробелов вокруг угловых скобок
  minified = minified.replace(/>\s+</g, '><');

  // Удаление пробелов после = в атрибутах
  minified = minified.replace(/=\s+"/g, '="');

  return minified;
}

/**
 * Удаление inline стилей из SVG для корректной работы fill/stroke
 */
export function removeInlineStyles(svgContent: string): string {
  let cleaned = svgContent;

  // Удаление style атрибутов, которые содержат fill или stroke
  cleaned = cleaned.replace(/\s*style="[^"]*"/gi, (match) => {
    // Сохраняем только те стили, которые не связаны с fill/stroke
    const styleContent = match.match(/style="([^"]*)"/i);
    if (!styleContent) return match;

    const styles = styleContent[1];
    const filteredStyles = styles
      .split(';')
      .filter(style => {
        const prop = style.trim().split(':')[0]?.toLowerCase();
        return prop && !['fill', 'stroke', 'stroke-width'].includes(prop);
      })
      .join(';');

    return filteredStyles ? ` style="${filteredStyles}"` : '';
  });

  // Удаление <style> блоков
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Удаление fill/stroke атрибутов, чтобы можно было управлять ими динамически
  // (опционально, закомментировано - можно включить если нужно)
  // cleaned = cleaned.replace(/\s*fill="[^"]*"/gi, '');
  // cleaned = cleaned.replace(/\s*stroke="[^"]*"/gi, '');

  return cleaned;
}

/**
 * Нормализация SVG (добавление viewBox если отсутствует, удаление width/height)
 */
export function normalizeSVG(svgContent: string): string {
  let normalized = svgContent;

  // Извлечение <svg> тега
  const svgTagMatch = normalized.match(/<svg[^>]*>/);
  if (!svgTagMatch) return normalized;

  const svgTag = svgTagMatch[0];
  let newSvgTag = svgTag;

  // Проверка наличия viewBox
  if (!svgTag.includes('viewBox')) {
    // Попытка извлечь width и height для создания viewBox
    const widthMatch = svgTag.match(/width="([^"]+)"/);
    const heightMatch = svgTag.match(/height="([^"]+)"/);

    if (widthMatch && heightMatch) {
      const width = parseFloat(widthMatch[1]);
      const height = parseFloat(heightMatch[1]);

      if (!isNaN(width) && !isNaN(height)) {
        newSvgTag = newSvgTag.replace(
          /<svg/,
          `<svg viewBox="0 0 ${width} ${height}"`
        );
      }
    }
  }

  // Удаление width и height из SVG тега (будем управлять через CSS)
  newSvgTag = newSvgTag.replace(/\s*width="[^"]*"/gi, '');
  newSvgTag = newSvgTag.replace(/\s*height="[^"]*"/gi, '');

  // Добавление width="100%" height="100%" для масштабируемости
  newSvgTag = newSvgTag.replace(/<svg/, '<svg width="100%" height="100%"');

  normalized = normalized.replace(svgTagMatch[0], newSvgTag);

  return normalized;
}

/**
 * Полная обработка SVG (валидация + минификация + нормализация)
 */
export function processSVG(
  svgContent: string,
  options: {
    minify?: boolean;
    removeStyles?: boolean;
    normalize?: boolean;
  } = {}
): { success: boolean; svg?: string; error?: string; warnings?: string[] } {
  const { minify = true, removeStyles = true, normalize = true } = options;

  // Валидация
  const validation = validateSVG(svgContent);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  let processed = svgContent;

  // Минификация
  if (minify) {
    processed = minifySVG(processed);
  }

  // Удаление inline стилей
  if (removeStyles) {
    processed = removeInlineStyles(processed);
  }

  // Нормализация
  if (normalize) {
    processed = normalizeSVG(processed);
  }

  return {
    success: true,
    svg: processed,
    warnings: validation.warnings,
  };
}

/**
 * Чтение SVG из файла
 */
export async function readSVGFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) {
        reject(new Error('Не удалось прочитать файл'));
        return;
      }
      resolve(content);
    };

    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };

    reader.readAsText(file);
  });
}

/**
 * Получение размера SVG в байтах
 */
export function getSVGSize(svgContent: string): {
  bytes: number;
  kilobytes: number;
} {
  const bytes = new Blob([svgContent]).size;
  const kilobytes = bytes / 1024;

  return { bytes, kilobytes };
}

/**
 * Извлечение viewBox из SVG
 */
export function extractViewBox(svgContent: string): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) return null;

  const values = viewBoxMatch[1].split(/\s+/).map(parseFloat);
  if (values.length !== 4) return null;

  return {
    x: values[0],
    y: values[1],
    width: values[2],
    height: values[3],
  };
}
