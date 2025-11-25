import type { TextElement as TextType } from '../../../types';
import { useCurvedTextVectorization } from '../../../hooks/useCurvedTextVectorization';

interface TextElementProps {
  element: TextType;
  scale: number;
}

export const TextElement = ({ element, scale }: TextElementProps) => {
  if (!element.visible) return null;

  const fontWeight = element.bold ? 'bold' : 'normal';
  const fontStyle = element.italic ? 'italic' : 'normal';
  const isFlipped = element.flipped || false;

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
    };

    const { svgContent, loading } = useCurvedTextVectorization(curvedTextProps, scale);

    if (loading) {
      // Пока грузится, показываем временное сообщение
      return (
        <text
          x={element.x * scale}
          y={element.y * scale}
          fill={element.color}
          fontSize={element.fontSize * scale}
          fontFamily={element.fontFamily}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          [Loading...]
        </text>
      );
    }

    // Возвращаем векторизованные пути как SVG разметку
    return <g dangerouslySetInnerHTML={{ __html: svgContent }} />;
  }

  // Обычный текст
  const transform = isFlipped ? `rotate(180 ${element.x * scale} ${element.y * scale})` : undefined;

  return (
    <text
      x={element.x * scale}
      y={element.y * scale}
      fill={element.color}
      fontSize={element.fontSize * scale}
      fontFamily={element.fontFamily}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      letterSpacing={element.letterSpacing || 0}
      textAnchor="middle"
      dominantBaseline="middle"
      transform={transform}
    >
      {element.text}
    </text>
  );
};
