import type { TextElement as TextType } from '../../../types';

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
    // Текст по кругу
    const pathId = `text-path-${element.id}`;
    const radius = element.curveRadius * scale;
    const startAngle = element.startAngle || 0;
    const cx = element.x * scale;
    const cy = element.y * scale;

    // Создаём полный круг вместо полукруга, чтобы текст не обрезался
    // Начинаем с startAngle и рисуем полный круг
    const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = cx + radius * Math.cos(((startAngle + 180) * Math.PI) / 180);
    const y2 = cy + radius * Math.sin(((startAngle + 180) * Math.PI) / 180);

    // Если текст перевернут, меняем направление дуги
    const sweepFlag = isFlipped ? 0 : 1;

    // Полный круг: две дуги по 180 градусов
    const pathD = `M ${x1},${y1} A ${radius},${radius} 0 0,${sweepFlag} ${x2},${y2} A ${radius},${radius} 0 0,${sweepFlag} ${x1},${y1}`;

    return (
      <g>
        <defs>
          <path
            id={pathId}
            d={pathD}
            fill="none"
          />
        </defs>
        <text
          fill={element.color}
          fontSize={element.fontSize * scale}
          fontFamily={element.fontFamily}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          letterSpacing={element.letterSpacing || 0}
        >
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {element.text}
          </textPath>
        </text>
      </g>
    );
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
