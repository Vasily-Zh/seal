import { useMemo } from 'react';
import type { StampElement, CircleElement as CircleType, TextElement as TextType, TextCenteredElement as TextCenteredType, IconElement as IconType } from '../../types';
import { getCachedSvg } from '../../utils/extractSvgFromIcon';

interface TemplatePreviewProps {
  elements: StampElement[];
  canvasSize: number;
  previewSize?: number; // размер превью в пикселях
}

/**
 * Компонент для рендеринга превью шаблона
 * Упрощённая версия Canvas без интерактивности
 */
export const TemplatePreview = ({ 
  elements, 
  canvasSize, 
  previewSize = 200 
}: TemplatePreviewProps) => {
  const scale = previewSize / canvasSize;

  return (
    <svg
      width={previewSize}
      height={previewSize}
      viewBox={`0 0 ${previewSize} ${previewSize}`}
      style={{ display: 'block' }}
    >
      <rect width={previewSize} height={previewSize} fill="white" />
      
      {elements
        .filter((e) => e.visible !== false && !e.parentId)
        .map((element) => {
          switch (element.type) {
            case 'circle':
              return <CirclePreview key={element.id} element={element as CircleType} scale={scale} />;
            case 'text':
              return <TextPreview key={element.id} element={element as TextType} scale={scale} canvasSize={canvasSize} />;
            case 'textCentered':
              return <TextCenteredPreview key={element.id} element={element as TextCenteredType} scale={scale} />;
            case 'icon':
              return <IconPreview key={element.id} element={element as IconType} scale={scale} />;
            default:
              return null;
          }
        })}
    </svg>
  );
};

// Превью круга
const CirclePreview = ({ element, scale }: { element: CircleType; scale: number }) => {
  const cx = element.x * scale;
  const cy = element.y * scale;
  const r = element.radius * scale;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={element.fill || 'none'}
      stroke={element.stroke || '#000'}
      strokeWidth={(element.strokeWidth || 1) * scale}
    />
  );
};

// Превью текста по дуге
const TextPreview = ({ element, scale, canvasSize }: { element: TextType; scale: number; canvasSize: number }) => {
  const text = element.text || '';
  const radius = element.curveRadius || canvasSize / 2 - 10;
  const fontSize = (element.fontSize || 4) * scale;
  const color = element.color || '#000';
  const flipped = element.flipped || false;
  const letterSpacing = element.letterSpacing || 0;
  
  // Центр
  const cx = (element.x || canvasSize / 2) * scale;
  const cy = (element.y || canvasSize / 2) * scale;
  const r = radius * scale;

  // Создаём path для текста
  const pathId = `text-path-preview-${element.id}`;
  
  let pathD: string;
  if (!flipped) {
    // Верхняя дуга (по часовой)
    pathD = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  } else {
    // Нижняя дуга (против часовой)
    pathD = `M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx - r} ${cy}`;
  }

  return (
    <g>
      <defs>
        <path id={pathId} d={pathD} fill="none" />
      </defs>
      <text
        fill={color}
        fontSize={fontSize}
        fontFamily={element.fontFamily || 'Roboto'}
        fontWeight={element.bold ? 'bold' : 'normal'}
        fontStyle={element.italic ? 'italic' : 'normal'}
        letterSpacing={letterSpacing * scale}
      >
        <textPath
          href={`#${pathId}`}
          startOffset="50%"
          textAnchor="middle"
        >
          {text}
        </textPath>
      </text>
    </g>
  );
};

// Превью центрированного текста
const TextCenteredPreview = ({ element, scale }: { element: TextCenteredType; scale: number }) => {
  const text = element.text || '';
  const x = (element.x || 0) * scale;
  const y = (element.y || 0) * scale;
  const fontSize = (element.fontSize || 4) * scale;
  const color = element.color || '#000';

  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={fontSize}
      fontFamily={element.fontFamily || 'Roboto'}
      fontWeight={element.bold ? 'bold' : 'normal'}
      fontStyle={element.italic ? 'italic' : 'normal'}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {text}
    </text>
  );
};

// Превью иконки
const IconPreview = ({ element, scale }: { element: IconType; scale: number }) => {
  const svgContent = useMemo(() => {
    if (element.iconSource === 'custom' && element.svgContent) {
      return element.svgContent;
    }
    
    if (element.iconSource === 'lucide' || element.iconSource === 'heroicons') {
      return getCachedSvg(element.iconName, element.iconSource, {
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
      });
    }
    
    return null;
  }, [element]);

  if (!svgContent) return null;

  // Масштабируем SVG
  const width = element.width * scale;
  const height = element.height * scale;
  const x = (element.x - element.width / 2) * scale;
  const y = (element.y - element.height / 2) * scale;

  // Заменяем размеры в SVG
  let scaledSvg = svgContent
    .replace(/width="[^"]*"/, `width="${width}"`)
    .replace(/height="[^"]*"/, `height="${height}"`);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      dangerouslySetInnerHTML={{ __html: scaledSvg }}
    />
  );
};
