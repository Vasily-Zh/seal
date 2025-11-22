import { Circle, Type, Square, Image, Orbit, Star, Search } from 'lucide-react';
import { useState } from 'react';
import { useStampStore } from '../../store/useStampStore';
import { DEFAULT_CONFIG } from '../../types';
import { IconGalleryModal } from './IconGalleryModal';
import { IconSearchModal } from './IconSearchModal';

export const Toolbar = () => {
  const addElement = useStampStore((state) => state.addElement);
  const canvasSize = useStampStore((state) => state.canvasSize);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [isIconGalleryOpen, setIsIconGalleryOpen] = useState(false);
  const [isIconSearchOpen, setIsIconSearchOpen] = useState(false);

  const handleAddCircle = () => {
    addElement({
      id: `circle-${Date.now()}`,
      type: 'circle',
      x: canvasSize / 2,
      y: canvasSize / 2,
      radius: DEFAULT_CONFIG.circleRadius,
      strokeWidth: DEFAULT_CONFIG.strokeWidth,
      stroke: DEFAULT_CONFIG.strokeColor,
      visible: true,
    });
  };

  const handleAddCurvedText = () => {
    addElement({
      id: `text-${Date.now()}`,
      type: 'text',
      x: canvasSize / 2,
      y: canvasSize / 2,
      text: 'ПРИМЕР ТЕКСТА ПО КРУГУ',
      fontSize: DEFAULT_CONFIG.fontSize,
      fontFamily: DEFAULT_CONFIG.fontFamily,
      curved: true,
      curveRadius: DEFAULT_CONFIG.curvedTextRadius,
      startAngle: 90,
      color: DEFAULT_CONFIG.textColor,
      bold: false,
      italic: false,
      visible: true,
    });
  };

  const handleAddCenteredText = () => {
    addElement({
      id: `textCentered-${Date.now()}`,
      type: 'textCentered',
      x: canvasSize / 2,
      y: canvasSize / 2,
      text: 'ТЕКСТ ПО ЦЕНТРУ',
      fontSize: DEFAULT_CONFIG.fontSize,
      fontFamily: DEFAULT_CONFIG.fontFamily,
      color: DEFAULT_CONFIG.textColor,
      bold: false,
      italic: false,
      visible: true,
    });
  };

  const handleAddRectangle = () => {
    addElement({
      id: `rectangle-${Date.now()}`,
      type: 'rectangle',
      x: canvasSize / 2,
      y: canvasSize / 2,
      width: 30,
      height: 20,
      stroke: DEFAULT_CONFIG.strokeColor,
      strokeWidth: DEFAULT_CONFIG.strokeWidth,
      visible: true,
    });
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          addElement({
            id: `image-${Date.now()}`,
            type: 'image',
            x: canvasSize / 2,
            y: canvasSize / 2,
            width: 30,
            height: 30,
            src: src,
            visible: true,
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const tools = [
    { icon: Circle, label: 'Добавить круг', onClick: handleAddCircle, id: 'circle' },
    { icon: Square, label: 'Добавить прямоугольник', onClick: handleAddRectangle, id: 'rectangle' },
    { icon: Orbit, label: 'Добавить текст по кругу', onClick: handleAddCurvedText, id: 'curvedText' },
    { icon: Type, label: 'Добавить текст', onClick: handleAddCenteredText, id: 'text' },
    { icon: Star, label: 'Добавить иконку', onClick: () => setIsIconGalleryOpen(true), id: 'icon' },
    { icon: Search, label: 'Поиск картинок', onClick: () => setIsIconSearchOpen(true), id: 'iconSearch' },
    { icon: Image, label: 'Своя картинка', onClick: handleAddImage, id: 'image' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
      }}
    >
      {tools.map((tool) => (
        <div key={tool.id} style={{ position: 'relative' }}>
          <button
            onClick={tool.onClick}
            onMouseEnter={(e) => {
              setHoveredTool(tool.id);
              e.currentTarget.style.backgroundColor = '#bae6fd';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              setHoveredTool(null);
              e.currentTarget.style.backgroundColor = '#e0f2fe';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#e0f2fe',
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '100%',
            }}
          >
            <tool.icon size={28} color="#0369a1" />
          </button>

          {/* Tooltip */}
          {hoveredTool === tool.id && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '100%',
                transform: 'translateX(-50%)',
                marginBottom: '8px',
                backgroundColor: '#1f2937',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                pointerEvents: 'none',
              }}
            >
              {tool.label}
              {/* Стрелка tooltip */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '100%',
                  transform: 'translateX(-50%)',
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '4px solid #1f2937',
                }}
              />
            </div>
          )}
        </div>
      ))}

      {/* Icon Gallery Modal */}
      <IconGalleryModal isOpen={isIconGalleryOpen} onClose={() => setIsIconGalleryOpen(false)} />

      {/* Icon Search Modal */}
      <IconSearchModal isOpen={isIconSearchOpen} onClose={() => setIsIconSearchOpen(false)} />
    </div>
  );
};
