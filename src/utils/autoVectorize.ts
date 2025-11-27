import { potrace, init } from 'esm-potrace-wasm';

/**
 * Конфигурация для Potrace
 */
export interface PotraceConfig {
  // Порог для чёрно-белого изображения (0-255)
  threshold?: number;
  // Оптимизация кривых Безье
  turnPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority';
  // Угловой порог (0-1.34)
  turdSize?: number;
  // Оптимизация (0-1)
  alphaMax?: number;
  // Подавление случайного шума
  optCurve?: boolean;
  // Толерантность цвета
  optTolerance?: number;
}

/**
 * Векторизует PNG изображение в SVG через Potrace WASM
 * @param imageSource - HTMLImageElement, Canvas или Blob
 * @param config - Конфигурация Potrace
 * @returns SVG строка с векторными path-элементами
 */
export const vectorizePNGToSVG = async (
  imageSource: HTMLImageElement | HTMLCanvasElement | Blob,
  config: PotraceConfig = {}
): Promise<string> => {
  // Инициализируем Potrace WASM (нужно сделать один раз)
  await init();

  // Параметры Potrace
  const options = {
    turdsize: config.turdSize ?? 2,
    turnpolicy: getTurnPolicy(config.turnPolicy ?? 'minority'),
    alphamax: config.alphaMax ?? 1.0,
    opticurve: config.optCurve ? 1 : 0,
    opttolerance: config.optTolerance ?? 0.2,
    pathonly: false,
    extractcolors: true,
    posterizelevel: 2,
    posterizationalgorithm: 0,
  };

  // Запускаем векторизацию
  const svgString = await potrace(imageSource, options);

  return svgString;
};

/**
 * Конвертирует string turnPolicy в числовое значение для Potrace
 */
function getTurnPolicy(policy: string): number {
  const policies: Record<string, number> = {
    'black': 0,
    'white': 1,
    'left': 2,
    'right': 3,
    'minority': 4,
    'majority': 5,
  };
  return policies[policy] ?? 4;
}

/**
 * Векторизует цветное PNG изображение с сохранением цветов
 * Использует автоматическое извлечение цветов из Potrace
 */
export const vectorizeColoredPNG = async (
  imageSource: HTMLImageElement | HTMLCanvasElement | Blob,
  config: PotraceConfig = {}
): Promise<string> => {
  // Просто вызываем основную функцию, т.к. Potrace с extractcolors=true
  // уже поддерживает цветную векторизацию
  return vectorizePNGToSVG(imageSource, config);
};
