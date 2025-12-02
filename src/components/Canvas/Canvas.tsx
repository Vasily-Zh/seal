import { useRef, useState, useEffect } from "react";
import { useStampStore } from "../../store/useStampStore";
import { CircleElement } from "./elements/CircleElement";
import { TextElement } from "./elements/TextElement";
import { TextCenteredElement } from "./elements/TextCenteredElement";
import { RectangleElement } from "./elements/RectangleElement";
import { TriangleElement } from "./elements/TriangleElement";
import { ImageElement } from "./elements/ImageElement";
import { IconElement } from "./elements/IconElement";
import { LineElement } from "./elements/LineElement";
import { GroupElement } from "./elements/GroupElement";

export const Canvas = () => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const elements = useStampStore((state) => state.elements);
  const selectedElementId = useStampStore((state) => state.selectedElementId);
  const canvasSize = useStampStore((state) => state.canvasSize);

  // Размер SVG - начинаем с null
  const [svgSize, setSvgSize] = useState<number | null>(null);
  // Флаг что размер стабилизировался
  const [sizeStable, setSizeStable] = useState(false);
  const stabilizeTimer = useRef<number | null>(null);

  // Адаптивный размер SVG - без анимаций
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      // Учитываем padding 10px с каждой стороны
      const size = Math.max(Math.min(w - 20, h - 20), 220);
      
      setSvgSize(size);
      
      // Сбрасываем стабильность и ждём пока размер устаканится
      setSizeStable(false);
      if (stabilizeTimer.current) {
        clearTimeout(stabilizeTimer.current);
      }
      stabilizeTimer.current = window.setTimeout(() => {
        setSizeStable(true);
      }, 50); // 50ms достаточно чтобы layout устаканился
    };

    // Мгновенный расчёт при монтировании
    updateSize();
    
    window.addEventListener("resize", updateSize);

    const ro = new ResizeObserver(updateSize);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateSize);
      ro.disconnect();
      if (stabilizeTimer.current) {
        clearTimeout(stabilizeTimer.current);
      }
    };
  }, []);

  // Пока размер не определён - показываем пустой контейнер
  if (svgSize === null) {
    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          flex: "1",
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          padding: "10px",
          boxSizing: "border-box",
        }}
      />
    );
  }

  const scale = svgSize / canvasSize;
  const rulerStep = 5;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        flex: "1",                    // Главное: занимает всё доступное место
        minHeight: 0,                 // важно для flex
        display: "flex",
        alignItems: "center",         // центрируем SVG по вертикали и горизонтали
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        padding: "10px",
        boxSizing: "border-box",
        overflow: "hidden",           // чтобы не было лишних скроллов
      }}
    >
      <div
        style={{
          border: "1px solid #d1d5db",
          backgroundColor: "white",
          borderRadius: "6px",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <svg
          ref={canvasRef}
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          style={{ display: "block" }}
          id="stamp-canvas"
        >
          <defs>
            <pattern
              id="grid-pattern"
              width={5 * scale}
              height={5 * scale}
              patternUnits="userSpaceOnUse"
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
            >
              <path
                d={`M ${1 * scale} 0 L 0 0 0 ${1 * scale}`}
                fill="none"
                stroke="#000000ff"
                strokeWidth="0.1"
              />
            </pattern>
          </defs>

          <rect width={svgSize} height={svgSize} fill="white" />

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

          {/* Линейки */}
          <g data-export-exclude="true">
            {Array.from({ length: Math.floor(canvasSize / rulerStep) + 1 }).map((_, i) => {
              const mm = i * rulerStep;
              if (mm === 0) return null;
              const pos = mm * scale;
              return (
                <line
                  key={i}
                  x1={pos}
                  y1={0}
                  x2={pos}
                  y2={10}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
              );
            })}

            {Array.from({ length: Math.floor(canvasSize / rulerStep) + 1 }).map((_, i) => {
              const mm = i * rulerStep;
              if (mm === 0) return null;
              const pos = mm * scale;
              return (
                <line
                  key={"h" + i}
                  x1={0}
                  y1={pos}
                  x2={10}
                  y2={pos}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
              );
            })}
          </g>

          {/* Элементы макета - рендерим только когда размер стабилизировался */}
          {sizeStable && elements
            .filter((e) => !e.parentId)
            .map((element) => {
              switch (element.type) {
                case "circle":
                  return <CircleElement key={element.id} element={element} scale={scale} />;
                case "text":
                  return <TextElement key={element.id} element={element} scale={scale} />;
                case "textCentered":
                  return <TextCenteredElement key={element.id} element={element} scale={scale} />;
                case "rectangle":
                  return <RectangleElement key={element.id} element={element} scale={scale} />;
                case "triangle":
                  return <TriangleElement key={element.id} element={element} scale={scale} />;
                case "image":
                  return <ImageElement key={element.id} element={element} scale={scale} />;
                case "icon":
                  return <IconElement key={element.id} element={element} scale={scale} />;
                case "line":
                  return <LineElement key={element.id} element={element} scale={scale} />;
                case "group":
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