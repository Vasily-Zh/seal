import { useMemo } from 'react';
import type { StampElement, CircleElement as CircleType, TextElement as TextType, TextCenteredElement as TextCenteredType, IconElement as IconType } from '../../types';
import { getCachedSvg } from '../../utils/extractSvgFromIcon';
import { useCurvedTextVectorization } from '../../hooks/useCurvedTextVectorization';
import { useCenteredTextVectorization } from '../../hooks/useCenteredTextVectorization';

interface TemplatePreviewProps {
  elements: StampElement[];
  canvasSize: { width: number; height: number };
  previewSize?: number;
}

/**
 * Компонент для рендеринга превью шаблона
 * Использует те же хуки векторизации что и основной Canvas
 */
export const TemplatePreview = ({ 
  elements, 
  canvasSize, 
  previewSize = 200 
}: TemplatePreviewProps) => {
  const scale = previewSize / canvasSize.width;

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
              return <TextPreview key={element.id} element={element as TextType} scale={scale} />;
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

// Превью текста по дуге - используем тот же хук что и основной Canvas
const TextPreview = ({ element, scale }: { element: TextType; scale: number }) => {
  if (!element.text) return null;

  const fontWeight = element.bold ? 'bold' : 'normal';
  const fontStyle = element.italic ? 'italic' : 'normal';
  const isFlipped = element.flipped || false;
  const letterSpacing = element.letterSpacing || 0;

  // Для curved текста
  if (element.curved && element.curveRadius) {
    const curvedTextProps = {
      text: element.text,
      cx: element.x,
      cy: element.y,
      radius: element.curveRadius,
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      color: element.color,
      startAngle: element.startAngle || 0,
      isFlipped,
      fontWeight,
      fontStyle,
      letterSpacing,
    };

    const { svgContent, loading } = useCurvedTextVectorization(curvedTextProps, scale);

    if (loading || !svgContent) {
      return null;
    }

    return <g dangerouslySetInnerHTML={{ __html: svgContent }} />;
  }

  // Для прямого текста - используем хук центрированного текста
  const straightTextProps = {
    text: element.text,
    x: element.x,
    y: element.y,
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight,
    fontStyle,
    letterSpacing,
  };

  const { svgContent, loading } = useCenteredTextVectorization(straightTextProps, scale);

  if (loading || !svgContent) {
    return null;
  }

  const transform = isFlipped ? `rotate(180 ${element.x * scale} ${element.y * scale})` : undefined;

  return <g transform={transform} dangerouslySetInnerHTML={{ __html: svgContent }} />;
};

// Превью центрированного текста
const TextCenteredPreview = ({ element, scale }: { element: TextCenteredType; scale: number }) => {
  if (!element.text) return null;

  const fontWeight = element.bold ? 'bold' : 'normal';
  const fontStyle = element.italic ? 'italic' : 'normal';
  const isFlipped = element.flipped || false;

  const textProps = {
    text: element.text,
    x: element.x,
    y: element.y,
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight,
    fontStyle,
    letterSpacing: element.letterSpacing || 0,
  };

  const { svgContent, loading } = useCenteredTextVectorization(textProps, scale);

  if (loading || !svgContent) {
    return null;
  }

  const transform = isFlipped ? `rotate(180 ${element.x * scale} ${element.y * scale})` : undefined;

  return <g transform={transform} dangerouslySetInnerHTML={{ __html: svgContent }} />;
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
  }, [element.iconName, element.iconSource, element.svgContent, element.fill, element.stroke, element.strokeWidth]);

  if (!svgContent) return null;

  const width = element.width * scale;
  const height = element.height * scale;
  const x = (element.x - element.width / 2) * scale;
  const y = (element.y - element.height / 2) * scale;

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
