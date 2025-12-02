import type { TextElement as TextType } from '../../../types';
import { useCurvedTextVectorization } from '../../../hooks/useCurvedTextVectorization';
import { useCenteredTextVectorization } from '../../../hooks/useCenteredTextVectorization';

interface TextElementProps {
  element: TextType;
  scale: number;
}

export const TextElement = ({ element, scale }: TextElementProps) => {
  if (!element.visible) return null;

  const fontWeight = element.bold ? 'bold' : 'normal';
  const fontStyle = element.italic ? 'italic' : 'normal';
  const isFlipped = element.flipped || false;
  const letterSpacing = element.letterSpacing || 0;

  if (element.curved && element.curveRadius) {
    // Текст по кругу - используем векторизованные пути для корректного экспорта в CorelDRAW
    const curvedTextProps = {
      text: element.text,
      cx: element.x,
      cy: element.y,
      radius: element.curveRadius,
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      color: element.color,
      startAngle: element.startAngle || 0,
      isFlipped,
      fontWeight,
      fontStyle,
      letterSpacing,
    };

    const { svgContent, loading } = useCurvedTextVectorization(curvedTextProps, scale);

    // Если ещё грузится или нет контента - не показываем ничего (без скачков)
    if (loading || !svgContent) {
      return null;
    }

    // Возвращаем векторизованные пути как SVG разметку
    return <g dangerouslySetInnerHTML={{ __html: svgContent }} />;
  }

  // Обычный прямой текст - также векторизуем для корректного экспорта
  const straightTextProps = {
    text: element.text,
    x: element.x,
    y: element.y,
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight,
    fontStyle,
    letterSpacing,
  };

  const { svgContent: straightSvgContent, loading: straightLoading } = useCenteredTextVectorization(straightTextProps, scale);

  // Если ещё грузится или нет контента - не показываем ничего
  if (straightLoading || !straightSvgContent) {
    return null;
  }

  // Применяем поворот если нужно
  const transform = isFlipped ? `rotate(180 ${element.x * scale} ${element.y * scale})` : undefined;

  // Возвращаем векторизованные пути как SVG разметку
  return <g transform={transform} dangerouslySetInnerHTML={{ __html: straightSvgContent }} />;
};
