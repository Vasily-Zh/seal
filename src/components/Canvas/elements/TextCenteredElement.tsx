import type { TextCenteredElement as TextCenteredType } from '../../../types';
import { useCenteredTextVectorization } from '../../../hooks/useCenteredTextVectorization';

interface TextCenteredElementProps {
  element: TextCenteredType;
  scale: number;
}

export const TextCenteredElement = ({ element, scale }: TextCenteredElementProps) => {
  if (!element.visible) return null;

  const fontWeight = element.bold ? 'bold' : 'normal';
  const fontStyle = element.italic ? 'italic' : 'normal';
  const isFlipped = element.flipped || false;

  // Используем векторизацию для корректного экспорта с Google Fonts
  const centeredTextProps = {
    text: element.text,
    x: element.x,
    y: element.y,
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight,
    fontStyle,
  };

  const { svgContent, loading } = useCenteredTextVectorization(centeredTextProps, scale);

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

  // Применяем поворот если нужно
  const transform = isFlipped ? `rotate(180 ${element.x * scale} ${element.y * scale})` : undefined;

  // Возвращаем векторизованные пути как SVG разметку
  return <g transform={transform} dangerouslySetInnerHTML={{ __html: svgContent }} />;
};
