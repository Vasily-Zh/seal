import { useRef } from 'react';
import { useStampStore } from '../../store/useStampStore';
import { CircleElement } from './elements/CircleElement';
import { TextElement } from './elements/TextElement';

export const Canvas = () => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const elements = useStampStore((state) => state.elements);
  const canvasSize = useStampStore((state) => state.canvasSize);

  // Размер SVG в пикселях (для отображения)
  const svgSize = 600; // px
  const scale = svgSize / canvasSize;

  // Размер сетки в мм
  const gridStep = 5; // шаг сетки 5мм

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
      <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>
        Превью
      </div>

      {/* SVG Canvas */}
      <div style={{ position: 'relative', border: '2px solid #e5e7eb', backgroundColor: 'white' }}>
        <svg
          ref={canvasRef}
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          style={{ display: 'block' }}
          id="stamp-canvas"
        >
          {/* Сетка */}
          <defs>
            <pattern
              id="grid"
              width={gridStep * scale}
              height={gridStep * scale}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridStep * scale} 0 L 0 0 0 ${gridStep * scale}`}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          {/* Фон с сеткой */}
          <rect width={svgSize} height={svgSize} fill="url(#grid)" />

          {/* Линейки */}
          {/* Верхняя линейка */}
          {Array.from({ length: Math.floor(canvasSize / gridStep) }).map((_, i) => {
            const pos = (i + 1) * gridStep * scale;
            return (
              <g key={`top-${i}`}>
                <line
                  x1={pos}
                  y1={0}
                  x2={pos}
                  y2={8}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                {(i + 1) % 2 === 0 && (
                  <text
                    x={pos}
                    y={18}
                    fontSize="10"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {(i + 1) * gridStep}
                  </text>
                )}
              </g>
            );
          })}

          {/* Левая линейка */}
          {Array.from({ length: Math.floor(canvasSize / gridStep) }).map((_, i) => {
            const pos = (i + 1) * gridStep * scale;
            return (
              <g key={`left-${i}`}>
                <line
                  x1={0}
                  y1={pos}
                  x2={8}
                  y2={pos}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                {(i + 1) % 2 === 0 && (
                  <text
                    x={18}
                    y={pos + 4}
                    fontSize="10"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {(i + 1) * gridStep}
                  </text>
                )}
              </g>
            );
          })}

          {/* Рендеринг элементов */}
          {elements.map((element) => {
            switch (element.type) {
              case 'circle':
                return <CircleElement key={element.id} element={element} scale={scale} />;
              case 'text':
                return <TextElement key={element.id} element={element} scale={scale} />;
              default:
                return null;
            }
          })}
        </svg>

        {/* Размеры внизу */}
        <div
          style={{
            marginTop: '12px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          Размер клише: {canvasSize} мм × {canvasSize} мм
        </div>
      </div>
    </div>
  );
};
