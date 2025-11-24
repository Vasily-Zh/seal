import { optimize } from 'svgo';

interface OptimizeSVGOptions {
  precision?: number; // Точность округления чисел (по умолчанию 2)
  removeComments?: boolean; // Удалить комментарии
  removeMetadata?: boolean; // Удалить метаданные
}

/**
 * Оптимизирует SVG строку используя SVGO
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
    // Собираем плагины
    const plugins: any[] = [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // Отключаем некоторые плагины которые могут навредить
            removeViewBox: false, // Не удаляем viewBox - он нужен для правильного масштабирования
            cleanupIds: false, // Не чистим ID - они могут использоваться
          },
        },
      },
      // Дополнительные плагины для оптимизации
      'removeDoctype',
      'removeXMLProcInst',
      'removeEditorsNSData',
      'cleanupAttrs',
      'mergeStyles',
      'inlineStyles',
      {
        name: 'minifyStyles',
        params: {
          usage: {
            force: true,
          },
        },
      },
      {
        name: 'cleanupNumericValues',
        params: {
          floatPrecision: precision,
        },
      },
      'convertColors',
      'removeUselessDefs',
      'mergePaths',
      'convertShapeToPath',
      'removeEmptyContainers',
      'removeUnusedNS',
      'sortAttrs',
      {
        name: 'removeDimensions',
        params: {},
      },
    ];

    // Добавляем условные плагины
    if (removeComments) {
      plugins.push('removeComments');
    }
    if (removeMetadata) {
      plugins.push('removeMetadata');
    }

    const result = optimize(svgString, {
      multipass: true, // Несколько проходов для лучшей оптимизации
      plugins,
    });

    if (result.data) {
      return result.data;
    }

    throw new Error('SVGO optimization failed');
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
