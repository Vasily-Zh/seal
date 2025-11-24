import { useRef } from 'react';
import { useStampStore } from '../../store/useStampStore';
import { CircleElement } from './elements/CircleElement';
import { TextElement } from './elements/TextElement';
import { TextCenteredElement } from './elements/TextCenteredElement';
import { RectangleElement } from './elements/RectangleElement';
import { ImageElement } from './elements/ImageElement';
import { IconElement } from './elements/IconElement';
import { GroupElement } from './elements/GroupElement';

export const Canvas = () => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const elements = useStampStore((state) => state.elements);
  const selectedElementId = useStampStore((state) => state.selectedElementId);
  const canvasSize = useStampStore((state) => state.canvasSize);

  // Размер SVG в пикселях (для отображения) - адаптивный
  const maxSvgSize = 500; // максимальный размер для превью
  const svgSize = maxSvgSize;
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
  const clicheSize = Math.ceil(maxRadius * 2);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#f9fafb',
        padding: '20px',
        position: 'relative',
      }}
    >
      {/* SVG Canvas */}
      <div style={{ position: 'relative', border: '1px solid #d1d5db', backgroundColor: 'white', maxWidth: '100%', maxHeight: '100%' }}>
        <svg
          ref={canvasRef}
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          style={{ display: 'block' }}
          id="stamp-canvas"
        >
          {/* Фон белый без сетки */}
          <rect width={svgSize} height={svgSize} fill="white" />

          {/* Линейки */}
          {/* Метка 0 на верхней линейке */}
          <text x={0} y={12} fontSize="10" fill="#ef4444" textAnchor="start" fontWeight="bold">
            0
          </text>

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
                  y2={isMajor ? 10 : 5}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                {isMajor && (
                  <text
                    x={pos}
                    y={20}
                    fontSize="10"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {mmValue}
                  </text>
                )}
              </g>
            );
          })}

          {/* Метка canvasSize на верхней линейке справа */}
          <text
            x={svgSize - 2}
            y={12}
            fontSize="10"
            fill="#ef4444"
            textAnchor="end"
            fontWeight="bold"
          >
            {canvasSize}мм
          </text>

          {/* Метка 0 на левой линейке */}
          <text x={12} y={10} fontSize="10" fill="#ef4444" textAnchor="start" fontWeight="bold">
            0
          </text>

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
                  x2={isMajor ? 10 : 5}
                  y2={pos}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                {isMajor && (
                  <text
                    x={20}
                    y={pos + 4}
                    fontSize="10"
                    fill="#6b7280"
                    textAnchor="start"
                  >
                    {mmValue}
                  </text>
                )}
              </g>
            );
          })}

          {/* Метка canvasSize на левой линейке снизу */}
          <text
            x={12}
            y={svgSize - 2}
            fontSize="10"
            fill="#ef4444"
            textAnchor="start"
            fontWeight="bold"
          >
            {canvasSize}мм
          </text>

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
                case 'image':
                  return <ImageElement key={element.id} element={element} scale={scale} />;
                case 'icon':
                  return <IconElement key={element.id} element={element} scale={scale} />;
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

      {/* Размер клише */}
      <div
        style={{
          marginTop: '16px',
          fontSize: '16px',
          fontWeight: '600',
          color: '#111827',
          textAlign: 'center',
        }}
      >
        Размер клише: <span style={{ color: '#0369a1' }}>{clicheSize} мм × {clicheSize} мм</span>
      </div>
    </div>
  );
};
