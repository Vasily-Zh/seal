import { Circle, Type } from 'lucide-react';
import { useStampStore } from '../../store/useStampStore';
import { DEFAULT_CONFIG } from '../../types';

export const Toolbar = () => {
  const addElement = useStampStore((state) => state.addElement);
  const canvasSize = useStampStore((state) => state.canvasSize);

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

  const handleAddText = () => {
    addElement({
      id: `text-${Date.now()}`,
      type: 'text',
      x: canvasSize / 2,
      y: canvasSize / 2,
      text: 'Текст по кругу',
      fontSize: DEFAULT_CONFIG.fontSize,
      fontFamily: 'Roboto',
      curved: true,
      curveRadius: DEFAULT_CONFIG.circleRadius,
      startAngle: 180,
      color: DEFAULT_CONFIG.textColor,
      bold: false,
      italic: false,
      visible: true,
    });
  };

  const tools = [
    { icon: Circle, label: 'Окружность', onClick: handleAddCircle },
    { icon: Type, label: 'Текст', onClick: handleAddText },
  ];

  return (
    <div
      style={{
        padding: '16px',
        borderRight: '1px solid #e5e7eb',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100px',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
        Добавить
      </div>
      {tools.map((tool) => (
        <button
          key={tool.label}
          onClick={tool.onClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '16px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: '#e0f2fe',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#bae6fd';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e0f2fe';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <tool.icon size={28} color="#0369a1" />
          <span style={{ fontSize: '11px', color: '#0c4a6e', textAlign: 'center', fontWeight: '500' }}>
            {tool.label}
          </span>
        </button>
      ))}
    </div>
  );
};
