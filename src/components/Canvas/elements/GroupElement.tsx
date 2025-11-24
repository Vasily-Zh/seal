import type { GroupElement as GroupType, StampElement } from '../../../types';
import { CircleElement } from './CircleElement';
import { TextElement } from './TextElement';
import { TextCenteredElement } from './TextCenteredElement';
import { RectangleElement } from './RectangleElement';
import { ImageElement } from './ImageElement';
import { IconElement } from './IconElement';

interface GroupElementProps {
  element: GroupType;
  scale: number;
  allElements: StampElement[];
  isSelected: boolean;
}

export const GroupElement = ({ element, scale, allElements, isSelected }: GroupElementProps) => {
  if (!element.visible) return null;

  // Получаем дочерние элементы группы
  const childElements = allElements.filter((el) => element.children.includes(el.id));

  // Формируем transform для группы
  const transforms: string[] = [];

  if (element.rotation) {
    transforms.push(`rotate(${element.rotation} ${element.x * scale} ${element.y * scale})`);
  }

  if (element.scaleX !== undefined || element.scaleY !== undefined) {
    const sx = element.scaleX ?? 1;
    const sy = element.scaleY ?? 1;
    transforms.push(`scale(${sx} ${sy})`);
  }

  const transformAttr = transforms.length > 0 ? transforms.join(' ') : undefined;

  return (
    <g transform={transformAttr}>
      {/* Рендерим всех дочерних элементов группы */}
      {childElements.map((child) => {
        switch (child.type) {
          case 'circle':
            return <CircleElement key={child.id} element={child} scale={scale} />;
          case 'text':
            return <TextElement key={child.id} element={child} scale={scale} />;
          case 'textCentered':
            return <TextCenteredElement key={child.id} element={child} scale={scale} />;
          case 'rectangle':
            return <RectangleElement key={child.id} element={child} scale={scale} />;
          case 'image':
            return <ImageElement key={child.id} element={child} scale={scale} />;
          case 'icon':
            return <IconElement key={child.id} element={child} scale={scale} />;
          case 'group':
            // Рекурсивный рендеринг вложенных групп
            return (
              <GroupElement
                key={child.id}
                element={child}
                scale={scale}
                allElements={allElements}
                isSelected={false}
              />
            );
          default:
            return null;
        }
      })}

      {/* Пунктирная рамка при выборе группы */}
      {isSelected && childElements.length > 0 && (
        <g>
          {(() => {
            // Вычисляем bounding box всех дочерних элементов
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

            childElements.forEach((child) => {
              // Простое приближение - используем позицию элемента
              minX = Math.min(minX, child.x);
              minY = Math.min(minY, child.y);
              maxX = Math.max(maxX, child.x);
              maxY = Math.max(maxY, child.y);
            });

            const padding = 2; // мм
            return (
              <rect
                x={(minX - padding) * scale}
                y={(minY - padding) * scale}
                width={(maxX - minX + padding * 2) * scale}
                height={(maxY - minY + padding * 2) * scale}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={0.5}
              />
            );
          })()}
        </g>
      )}
    </g>
  );
};
