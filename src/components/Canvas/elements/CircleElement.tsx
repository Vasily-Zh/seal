import type { CircleElement as CircleType } from '../../../types';

interface CircleElementProps {
  element: CircleType;
  scale: number;
}

export const CircleElement = ({ element, scale }: CircleElementProps) => {
  if (!element.visible) return null;

  return (
    <circle
      cx={element.x * scale}
      cy={element.y * scale}
      r={element.radius * scale}
      fill={element.fill || 'none'}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth * scale}
      strokeDasharray={element.strokeDashArray ? `${element.strokeDashArray * scale}` : undefined}
    />
  );
};
