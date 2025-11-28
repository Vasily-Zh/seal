import type { TriangleElement } from '../../../types';
import { useStampStore } from '../../../store/useStampStore';

interface TriangleElementProps {
  element: TriangleElement;
  scale: number;
}

export const TriangleElement = ({ element, scale }: TriangleElementProps) => {
  const selectedElementId = useStampStore((state) => state.selectedElementId);
  const isSelected = selectedElementId === element.id;

  // Рассчитываем координаты вершин равностороннего треугольника
  // x, y - центр треугольника (центроид), а не одна из вершин
  const centerX = element.x * scale;
  const centerY = element.y * scale;
  const size = element.size * scale;

  // Вычисляем высоту равностороннего треугольника
  const height = (Math.sqrt(3) / 2) * size;

  // Располагаем треугольник с вершиной вверх
  // Вершины треугольника:
  const x1 = centerX; // верхняя вершина
  const y1 = centerY - (2/3) * height; // верхняя вершина (на 2/3 высоты выше центра)
  const x2 = centerX - size / 2; // левая нижняя вершина
  const y2 = centerY + (1/3) * height; // левая нижняя вершина (на 1/3 высоты ниже центра)
  const x3 = centerX + size / 2; // правая нижняя вершина
  const y3 = y2; // та же высота, что и левая нижняя

  return (
    <polygon
      points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
      fill={element.fill || 'none'}
      stroke={element.stroke}
      strokeWidth={isSelected ? element.strokeWidth * scale * 1.2 : element.strokeWidth * scale}
      style={{
        strokeWidth: isSelected ? element.strokeWidth * 1.2 : element.strokeWidth,
        stroke: element.stroke,
        fill: element.fill || 'none',
        pointerEvents: 'all',
      }}
      id={element.id}
      data-element-id={element.id}
      data-export-exclude={element.id.includes('default') ? 'false' : 'false'} // Все элементы экспортируются
    />
  );
};