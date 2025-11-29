import { useRef, useState, useEffect } from 'react';
import { useStampStore } from '../../store/useStampStore';
import { CircleElement } from './elements/CircleElement';
import { TextElement } from './elements/TextElement';
import { TextCenteredElement } from './elements/TextCenteredElement';
import { RectangleElement } from './elements/RectangleElement';
import { TriangleElement } from './elements/TriangleElement';
import { ImageElement } from './elements/ImageElement';
import { IconElement } from './elements/IconElement';
import { LineElement } from './elements/LineElement';
import { GroupElement } from './elements/GroupElement';

export const Canvas = () => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const elements = useStampStore((state) => state.elements);
  const selectedElementId = useStampStore((state) => state.selectedElementId);
  const canvasSize = useStampStore((state) => state.canvasSize);

  // Адаптивный размер SVG
  const [svgSize, setSvgSize] = useState(400);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const availableWidth = clientWidth - 20;
        const availableHeight = clientHeight - 40; // место под "Размер клише"
        const size = Math.max(Math.min(availableWidth, availableHeight), 210);
        setSvgSize(size);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    // ResizeObserver для отслеживания изменений контейнера
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();
    };
  }, []);

  const scale = svgSize / canvasSize;

  // Шаг линейки в мм
  const rulerStep = 5; // шаг меток линейки 5мм

  // Рассчитываем размер клише (диаметр самого большого круга)
  let maxRadius = 0;
  elements.forEach((el) => {
    if (el.type === 'circle') {
      maxRadius = Math.max(maxRadius, el.radius);
    }
  });
  // const clicheSize = Math.ceil(maxRadius);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#f9fafb',
        padding: '10px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* SVG Canvas */}
      <div style={{ 
        border: '1px solid #d1d5db', 
        backgroundColor: 'white',
        flexShrink: 0,
      }}>
        <svg
          ref={canvasRef}
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          style={{ display: 'block' }}
          id="stamp-canvas"
        >
          {/* Определение паттерна сетки - 5x5мм клетки */}
          <defs>
            <pattern
              id="grid-pattern"
              width={5 * scale}
              height={5 * scale}
              patternUnits="userSpaceOnUse"
              data-export-exclude="true"
            >
              <path
                d={`M ${5 * scale} 0 L 0 0 0 ${5 * scale}`}
                fill="none"
                stroke="#6b7280"
                strokeWidth="0.5"
              />
            </pattern>

             <pattern
                id="fine-grid-pattern"
                width={1 * scale}
                height={1 * scale}
                patternUnits="userSpaceOnUse"
                data-export-exclude="true"
              >
                <path
                  d={`M ${1 * scale} 0 L 0 0 0 ${1 * scale}`}
                  fill="none"
                  stroke="#000000ff"
                  strokeWidth="0.1"
                />
              </pattern>

          </defs>

          {/* Белый фон (экспортируется) */}
          <rect width={svgSize} height={svgSize} fill="white" />

          {/* Фоновая сетка (только для редактора) */}
          <rect
            width={svgSize}
            height={svgSize}
            fill="url(#grid-pattern)"
            data-export-exclude="true"
          />

                    <rect
            width={svgSize}
            height={svgSize}
            fill="url(#fine-grid-pattern)"
            data-export-exclude="true"
          />


          {/* Линейки - только для редактора */}
          <g data-export-exclude="true">
            {/* Метка 0 на верхней линейке */}
            {/* <text x={0} y={12} fontSize="10" fill="#ef4444" textAnchor="start" fontWeight="bold">
              0
            </text> */}

          {/* Верхняя линейка */}
          {Array.from({ length: Math.floor(canvasSize / rulerStep) + 1 }).map((_, i) => {
            const mmValue = i * rulerStep;
            const pos = mmValue * scale;
            const isMajor = mmValue % 10 === 0;

            if (mmValue === 0) return null; // Пропускаем 0, уже нарисовали

            return (
              <g key={`top-${i}`}>
                <line
                  x1={pos}
                  y1={0}
                  x2={pos}
                  y2={isMajor ? 10 : 10}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                {/* {isMajor && (
                  <text
                    x={pos}
                    y={20}
                    fontSize="10"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {mmValue}
                  </text>
                )} */}
              </g>
            );
          })}

          {/* Метка canvasSize на верхней линейке справа */}
          {/* <text
            x={svgSize - 2}
            y={12}
            fontSize="10"
            fill="#ef4444"
            textAnchor="end"
            fontWeight="bold"
          >
            {canvasSize}мм
          </text> */}

          {/* Метка 0 на левой линейке */}
          {/* <text x={12} y={10} fontSize="10" fill="#ef4444" textAnchor="start" fontWeight="bold">
            0
          </text> */}

          {/* Левая линейка */}
          {Array.from({ length: Math.floor(canvasSize / rulerStep) + 1 }).map((_, i) => {
            const mmValue = i * rulerStep;
            const pos = mmValue * scale;
            const isMajor = mmValue % 10 === 0;

            if (mmValue === 0) return null; // Пропускаем 0, уже нарисовали

            return (
              <g key={`left-${i}`}>
                <line
                  x1={0}
                  y1={pos}
                  x2={isMajor ? 10 : 10}
                  y2={pos}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                {/* {isMajor && (
                  <text
                    x={20}
                    y={pos + 4}
                    fontSize="10"
                    fill="#6b7280"
                    textAnchor="start"
                  >
                    {mmValue}
                  </text>
                )} */}
              </g>
            );
          })}

            {/* Метка canvasSize на левой линейке снизу */}
            {/* <text
              x={12}
              y={svgSize - 2}
              fontSize="10"
              fill="#ef4444"
              textAnchor="start"
              fontWeight="bold"
            >
              {canvasSize}мм
            </text> */}
          </g>

          {/* Рендеринг элементов */}
          {elements
            // Фильтруем элементы - рендерим только те, которые не имеют parentId (не вложены в группы)
            .filter((element) => !element.parentId)
            .map((element) => {
              switch (element.type) {
                case 'circle':
                  return <CircleElement key={element.id} element={element} scale={scale} />;
                case 'text':
                  return <TextElement key={element.id} element={element} scale={scale} />;
                case 'textCentered':
                  return <TextCenteredElement key={element.id} element={element} scale={scale} />;
                case 'rectangle':
                  return <RectangleElement key={element.id} element={element} scale={scale} />;
                case 'triangle':
                  return <TriangleElement key={element.id} element={element} scale={scale} />;
                case 'image':
                  return <ImageElement key={element.id} element={element} scale={scale} />;
                case 'icon':
                  return <IconElement key={element.id} element={element} scale={scale} />;
                case 'line':
                  return <LineElement key={element.id} element={element} scale={scale} />;
                case 'group':
                  return (
                    <GroupElement
                      key={element.id}
                      element={element}
                      scale={scale}
                      allElements={elements}
                      isSelected={selectedElementId === element.id}
                    />
                  );
                default:
                  return null;
              }
            })}
        </svg>
      </div>


    </div>
  );
};
