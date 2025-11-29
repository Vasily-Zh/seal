import { Circle, Type, Square, Triangle, Orbit, Star, Search, Wand2, Minus, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useStampStore } from '../../store/useStampStore';
import { DEFAULT_CONFIG } from '../../types';
import { IconGalleryModal } from './IconGalleryModal';
import { IconSearchModal } from './IconSearchModal';
import { VectorizationDialog } from './VectorizationDialog';

export const MobileToolbar = () => {
  const addElement = useStampStore((state) => state.addElement);
  const canvasSize = useStampStore((state) => state.canvasSize);
  const [isOpen, setIsOpen] = useState(false);
  const [isIconGalleryOpen, setIsIconGalleryOpen] = useState(false);
  const [isIconSearchOpen, setIsIconSearchOpen] = useState(false);
  const [isVectorizationOpen, setIsVectorizationOpen] = useState(false);

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
    setIsOpen(false);
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
      letterSpacing: 0,
      bold: false,
      italic: false,
      visible: true,
    });
    setIsOpen(false);
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
      letterSpacing: 0,
      bold: false,
      italic: false,
      visible: true,
    });
    setIsOpen(false);
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
    setIsOpen(false);
  };

  const handleAddTriangle = () => {
    addElement({
      id: `triangle-${Date.now()}`,
      type: 'triangle',
      x: canvasSize / 2,
      y: canvasSize / 2,
      size: 30,
      stroke: DEFAULT_CONFIG.strokeColor,
      strokeWidth: DEFAULT_CONFIG.strokeWidth,
      visible: true,
      heightRatio: 1, // по умолчанию равносторонний треугольник
    });
    setIsOpen(false);
  };

  const handleAddLine = () => {
    addElement({
      id: `line-${Date.now()}`,
      type: 'line',
      x: canvasSize / 2 - 20, // Начало линии
      y: canvasSize / 2,
      x2: canvasSize / 2 + 20, // Конец линии
      y2: canvasSize / 2,
      stroke: DEFAULT_CONFIG.strokeColor,
      strokeWidth: DEFAULT_CONFIG.strokeWidth,
      visible: true,
    });
    setIsOpen(false);
  };

  const tools = [
    { icon: Circle, label: 'Добавить круг', onClick: handleAddCircle, id: 'circle' },
    { icon: Square, label: 'Добавить прямоугольник', onClick: handleAddRectangle, id: 'rectangle' },
    { icon: Triangle, label: 'Добавить треугольник', onClick: handleAddTriangle, id: 'triangle' },
    { icon: Minus, label: 'Добавить линию', onClick: handleAddLine, id: 'line' },
    { icon: Orbit, label: 'Добавить текст по кругу', onClick: handleAddCurvedText, id: 'curvedText' },
    { icon: Type, label: 'Добавить текст', onClick: handleAddCenteredText, id: 'text' },
    { icon: Star, label: 'Добавить картинку', onClick: () => { setIsIconGalleryOpen(true); setIsOpen(false); }, id: 'icon' },
    { icon: Search, label: 'Поиск картинок', onClick: () => { setIsIconSearchOpen(true); setIsOpen(false); }, id: 'iconSearch' },
    { icon: Wand2, label: 'Векторизация (Potrace)', onClick: () => { setIsVectorizationOpen(true); setIsOpen(false); }, id: 'vectorize' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%' }} className="mobile-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: '#e0f2fe',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        className="touch-optimized"
      >
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#0369a1' }}>Добавить</span>
        <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            maxHeight: '300px',
            overflowY: 'auto',
            marginTop: '4px',
          }}
        >
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={tool.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                textAlign: 'left',
                fontSize: '14px',
              }}
              className="touch-optimized"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <tool.icon size={20} style={{ marginRight: '12px', color: '#0369a1' }} />
              {tool.label}
            </button>
          ))}
        </div>
      )}

      {/* Icon Gallery Modal */}
      <IconGalleryModal isOpen={isIconGalleryOpen} onClose={() => setIsIconGalleryOpen(false)} />

      {/* Icon Search Modal */}
      <IconSearchModal isOpen={isIconSearchOpen} onClose={() => setIsIconSearchOpen(false)} />

      {/* Vectorization Dialog */}
      <VectorizationDialog isOpen={isVectorizationOpen} onClose={() => setIsVectorizationOpen(false)} />
    </div>
  );
};