import { useMemo } from 'react';
import type { IconElement as IconType } from '../../../types';
import { getCachedSvg, applySvgStyles } from '../../../utils/extractSvgFromIcon';

interface IconElementProps {
  element: IconType;
  scale: number;
}

export const IconElement = ({ element, scale }: IconElementProps) => {
  if (!element.visible) return null;

  // Получаем SVG код с примененными стилями
  const svgContent = useMemo(() => {
    let content: string | null = null;

    if (element.iconSource === 'custom' && element.svgContent) {
      // Для custom SVG применяем стили напрямую
      content = applySvgStyles(element.svgContent, {
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
      });
    } else if (element.iconSource === 'lucide' || element.iconSource === 'heroicons') {
      // Для lucide и heroicons извлекаем SVG из компонента
      content = getCachedSvg(element.iconName, element.iconSource, {
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
      });
    }

    if (!content) {
      console.warn(`Icon ${element.iconName} from ${element.iconSource} could not be rendered`);
      return null;
    }

    // Для custom SVG устанавливаем правильные размеры
    if (element.iconSource === 'custom') {
      // Заменяем width/height на масштабированные значения
      content = content
        .replace(/width="[^"]*"/g, `width="${element.width * scale}"`)
        .replace(/height="[^"]*"/g, `height="${element.height * scale}"`);

      // Если нет width/height в исходном SVG, добавляем их
      if (!content.match(/width="/)) {
        content = content.replace('<svg', `<svg width="${element.width * scale}"`);
      }
      if (!content.match(/height="/)) {
        content = content.replace('<svg', `<svg height="${element.height * scale}"`);
      }

      // Убеждаемся что есть viewBox
      if (!content.includes('viewBox')) {
        content = content.replace('<svg', '<svg viewBox="0 0 1000 1000"');
      }
    } else {
      // Для lucide/heroicons заменяем width/height на масштабированные значения
      content = content
        .replace(/width="[^"]*"/, `width="${element.width * scale}"`)
        .replace(/height="[^"]*"/, `height="${element.height * scale}"`);

      // Если нет width/height в исходном SVG, добавляем их
      if (!content.match(/width="/)) {
        content = content.replace('<svg', `<svg width="${element.width * scale}"`);
      }
      if (!content.match(/height="/)) {
        content = content.replace('<svg', `<svg height="${element.height * scale}"`);
      }
    }

    return content;
  }, [
    element.iconName,
    element.iconSource,
    element.svgContent,
    element.fill,
    element.stroke,
    element.strokeWidth,
    element.width,
    element.height,
    scale,
  ]);

  if (!svgContent) {
    return null;
  }

  // Рендерим SVG контент через <g> с правильным позиционированием
  return (
    <g
      transform={`translate(${(element.x - element.width / 2) * scale}, ${(element.y - element.height / 2) * scale})`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
