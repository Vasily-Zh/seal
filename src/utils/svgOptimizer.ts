interface OptimizeSVGOptions {
  precision?: number; // Точность округления чисел (по умолчанию 2)
  removeComments?: boolean; // Удалить комментарии
  removeMetadata?: boolean; // Удалить метаданные
}

/**
 * Простая оптимизация SVG без использования SVGO (для совместимости с браузером)
 * @param svgString - SVG код для оптимизации
 * @param options - Опции оптимизации
 * @returns Оптимизированный SVG код
 */
export async function optimizeSVG(
  svgString: string,
  options: OptimizeSVGOptions = {}
): Promise<string> {
  const {
    precision = 2,
    removeComments = true,
    removeMetadata = true,
  } = options;

  try {
    let optimized = svgString;

    // Удаляем комментарии
    if (removeComments) {
      optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Удаляем лишние пробелы и переносы строк
    optimized = optimized
      .replace(/\s+/g, ' ') // Множественные пробелы в один
      .replace(/>\s+</g, '><') // Пробелы между тегами
      .trim();

    // Округляем числа до заданной точности
    if (precision >= 0) {
      optimized = optimized.replace(
        /(\d+\.\d+)/g,
        (match) => parseFloat(match).toFixed(precision)
      );
    }

    return optimized;
  } catch (error) {
    console.error('SVG optimization error:', error);
    // В случае ошибки возвращаем оригинальный SVG
    return svgString;
  }
}

/**
 * Получает статистику по оптимизации SVG
 * @param originalSvg - Оригинальный SVG
 * @param optimizedSvg - Оптимизированный SVG
 * @returns Объект со статистикой
 */
export function getOptimizationStats(originalSvg: string, optimizedSvg: string) {
  const originalSize = new Blob([originalSvg]).size;
  const optimizedSize = new Blob([optimizedSvg]).size;
  const savedBytes = originalSize - optimizedSize;
  const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

  return {
    originalSize,
    optimizedSize,
    savedBytes,
    savedPercent: parseFloat(savedPercent),
    ratio: (optimizedSize / originalSize).toFixed(3),
  };
}

/**
 * Оптимизирует SVG и возвращает статистику
 */
export async function optimizeSVGWithStats(
  svgString: string,
  options?: OptimizeSVGOptions
) {
  const optimizedSvg = await optimizeSVG(svgString, options);
  const stats = getOptimizationStats(svgString, optimizedSvg);

  return {
    optimizedSvg,
    stats,
  };
}
