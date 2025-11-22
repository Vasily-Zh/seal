import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as LucideIcons from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/solid';

/**
 * Извлекает SVG код из React компонента иконки и применяет стили
 */
export function extractSvgFromIcon(
  iconName: string,
  iconSource: 'lucide' | 'heroicons',
  options?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }
): string | null {
  try {
    let IconComponent: React.ComponentType<any> | undefined;

    // Получаем компонент иконки из библиотеки
    if (iconSource === 'lucide') {
      IconComponent = (LucideIcons as any)[iconName];
    } else if (iconSource === 'heroicons') {
      IconComponent = (HeroIcons as any)[iconName];
    }

    if (!IconComponent) {
      console.error(`Icon ${iconName} not found in ${iconSource}`);
      return null;
    }

    // Рендерим компонент в строку SVG
    const iconElement = createElement(IconComponent, {
      width: '100%',
      height: '100%',
      ...(options?.strokeWidth ? { strokeWidth: options.strokeWidth } : {}),
    });

    let svgString = renderToStaticMarkup(iconElement);

    // Применяем стили к SVG
    if (options?.fill || options?.stroke || options?.strokeWidth) {
      svgString = applySvgStyles(svgString, options);
    }

    return svgString;
  } catch (error) {
    console.error('Error extracting SVG from icon:', error);
    return null;
  }
}

/**
 * Применяет стили fill и stroke к SVG строке
 */
export function applySvgStyles(
  svgString: string,
  options: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }
): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      return svgString;
    }

    // Находим все графические элементы
    const graphicElements = svgElement.querySelectorAll(
      'path, circle, rect, polygon, polyline, ellipse, line'
    );

    graphicElements.forEach((el) => {
      // Если передан только fill (без stroke), удаляем stroke
      if (options.fill !== undefined && options.stroke === undefined) {
        el.setAttribute('fill', options.fill);
        el.setAttribute('stroke', 'none');
      }
      // Если передан только stroke (без fill), удаляем fill
      else if (options.stroke !== undefined && options.fill === undefined) {
        el.setAttribute('stroke', options.stroke);
        el.setAttribute('fill', 'none');
      }
      // Если переданы оба, применяем оба
      else if (options.fill !== undefined && options.stroke !== undefined) {
        el.setAttribute('fill', options.fill);
        el.setAttribute('stroke', options.stroke);
      }

      // Применяем strokeWidth
      if (options.strokeWidth !== undefined) {
        el.setAttribute('stroke-width', String(options.strokeWidth));
      }
    });

    // Сериализуем обратно в строку
    return new XMLSerializer().serializeToString(svgElement);
  } catch (error) {
    console.error('Error applying SVG styles:', error);
    return svgString;
  }
}

/**
 * Кеш для обработанных SVG (для оптимизации производительности)
 */
const svgCache = new Map<string, string>();

/**
 * Получает SVG с кешированием
 */
export function getCachedSvg(
  iconName: string,
  iconSource: 'lucide' | 'heroicons',
  options?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }
): string | null {
  const cacheKey = `${iconSource}:${iconName}:${JSON.stringify(options || {})}`;

  if (svgCache.has(cacheKey)) {
    return svgCache.get(cacheKey)!;
  }

  const svg = extractSvgFromIcon(iconName, iconSource, options);

  if (svg) {
    svgCache.set(cacheKey, svg);
  }

  return svg;
}

/**
 * Очищает кеш SVG (можно вызывать при изменении темы или для освобождения памяти)
 */
export function clearSvgCache(): void {
  svgCache.clear();
}
