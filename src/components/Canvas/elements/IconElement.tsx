import { useMemo } from 'react';
import type { IconElement as IconType } from '../../../types';
import * as LucideIcons from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/solid';

interface IconElementProps {
  element: IconType;
  scale: number;
}

export const IconElement = ({ element, scale }: IconElementProps) => {
  if (!element.visible) return null;

  // Получаем компонент иконки в зависимости от источника
  const IconComponent = useMemo(() => {
    if (element.iconSource === 'lucide') {
      // @ts-expect-error - динамический импорт иконки из lucide-react
      return LucideIcons[element.iconName];
    } else if (element.iconSource === 'heroicons') {
      // @ts-expect-error - динамический импорт иконки из heroicons
      return HeroIcons[element.iconName];
    } else if (element.iconSource === 'custom' && element.svgContent) {
      // Для custom SVG возвращаем null, будем рендерить через dangerouslySetInnerHTML
      return null;
    }
    return null;
  }, [element.iconName, element.iconSource, element.svgContent]);

  // Если используем custom SVG
  if (element.iconSource === 'custom' && element.svgContent) {
    return (
      <g
        transform={`translate(${(element.x - element.width / 2) * scale}, ${(element.y - element.height / 2) * scale})`}
        dangerouslySetInnerHTML={{ __html: element.svgContent }}
      />
    );
  }

  // Если компонент не найден, не рендерим
  if (!IconComponent) {
    console.warn(`Icon ${element.iconName} from ${element.iconSource} not found`);
    return null;
  }

  // Рендерим иконку из lucide-react или heroicons
  // Эти библиотеки возвращают SVG, который мы можем вставить в foreignObject
  return (
    <foreignObject
      x={(element.x - element.width / 2) * scale}
      y={(element.y - element.height / 2) * scale}
      width={element.width * scale}
      height={element.height * scale}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconComponent
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </foreignObject>
  );
};
