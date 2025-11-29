import type { LineElementType } from '../../../types';
import { useStampStore } from '../../../store/useStampStore';

interface LineElementProps {
  element: LineElementType;
  scale: number;
}

/**
 * Компонент для отображения линии на холсте
 * При выделении увеличивает толщину линии для лучшей видимости
 */
export const LineElement = ({ element, scale }: LineElementProps) => {
  const selectedElementId = useStampStore((state) => state.selectedElementId);
  const isSelected = selectedElementId === element.id;

  return (
    <line
      x1={element.x * scale}
      y1={element.y * scale}
      x2={element.x2 * scale}
      y2={element.y2 * scale}
      stroke={element.stroke}
      strokeWidth={isSelected ? element.strokeWidth * scale * 1.2 : element.strokeWidth * scale}
      style={{
        strokeWidth: isSelected ? element.strokeWidth * 1.2 : element.strokeWidth,
        stroke: element.stroke,
        fill: 'none',
        pointerEvents: 'all',
      }}
      id={element.id}
      data-element-id={element.id}
      data-export-exclude={element.id.includes('default') ? 'false' : 'false'} // Все элементы экспортируются
    />
  );
};