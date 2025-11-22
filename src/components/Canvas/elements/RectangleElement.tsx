import type { RectangleElement as RectangleType } from '../../../types';

interface RectangleElementProps {
  element: RectangleType;
  scale: number;
}

export const RectangleElement = ({ element, scale }: RectangleElementProps) => {
  if (!element.visible) return null;

  return (
    <rect
      x={(element.x - element.width / 2) * scale}
      y={(element.y - element.height / 2) * scale}
      width={element.width * scale}
      height={element.height * scale}
      fill={element.fill || 'none'}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth * scale}
    />
  );
};
