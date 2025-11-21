import { Undo2, Redo2, Download } from 'lucide-react';
import { useStampStore } from '../../store/useStampStore';
import { exportToPNG, exportToSVG } from '../../utils/export';
import { useState } from 'react';

export const Header = () => {
  const undo = useStampStore((state) => state.undo);
  const redo = useStampStore((state) => state.redo);
  const canUndo = useStampStore((state) => state.canUndo());
  const canRedo = useStampStore((state) => state.canRedo());
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportPNG = () => {
    const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
    exportToPNG(svgElement);
    setShowExportMenu(false);
  };

  const handleExportSVG = () => {
    const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
    exportToSVG(svgElement);
    setShowExportMenu(false);
  };

  return (
    <header
      style={{
        padding: '12px 24px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
          Конструктор печатей и штампов
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Кнопка Отмена */}
        <button
          onClick={undo}
          disabled={!canUndo}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: canUndo ? '#fff' : '#f3f4f6',
            cursor: canUndo ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: canUndo ? '#374151' : '#9ca3af',
          }}
        >
          <Undo2 size={16} />
          Отменить
        </button>

        {/* Кнопка Вернуть */}
        <button
          onClick={redo}
          disabled={!canRedo}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: canRedo ? '#fff' : '#f3f4f6',
            cursor: canRedo ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: canRedo ? '#374151' : '#9ca3af',
          }}
        >
          <Redo2 size={16} />
          Вернуть
        </button>

        {/* Кнопка Экспорт */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#3b82f6',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <Download size={16} />
            Сохранить
          </button>

          {showExportMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                minWidth: '150px',
              }}
            >
              <button
                onClick={handleExportPNG}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Сохранить как PNG
              </button>
              <button
                onClick={handleExportSVG}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Сохранить как SVG
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
