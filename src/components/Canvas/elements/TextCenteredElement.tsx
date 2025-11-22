import type { TextCenteredElement as TextCenteredType } from '../../../types';

interface TextCenteredElementProps {
  element: TextCenteredType;
  scale: number;
}

export const TextCenteredElement = ({ element, scale }: TextCenteredElementProps) => {
  if (!element.visible) return null;

  const fontWeight = element.bold ? 'bold' : 'normal';
  const fontStyle = element.italic ? 'italic' : 'normal';

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
      {element.text}
    </text>
  );
};
