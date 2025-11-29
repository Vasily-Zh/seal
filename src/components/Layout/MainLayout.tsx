import { Header } from '../Header/Header';
import { Toolbar } from '../Toolbar/Toolbar';
import { MobileToolbar } from '../Toolbar/MobileToolbar';
import { Controls } from '../Controls/Controls';
import { LayersPanel } from '../Controls/LayersPanel';
import { MobileLayersPanel } from '../Controls/MobileLayersPanel';
import { Canvas } from '../Canvas/Canvas';
import { useStampStore } from '../../store/useStampStore';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export const MainLayout = () => {
  const clearCanvas = useStampStore((state) => state.clearCanvas);

  const handleClearCanvas = () => {
    if (window.confirm('Вы уверены, что хотите удалить все элементы с макета?')) {
      clearCanvas();
    }
  };

  // Determine if we're on a mobile view based on screen width
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Шапка */}
      <Header />

      {/* Основной контент */}
      {isMobile ? (
        /* Mobile Layout */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="mobile-layout">
          {/* Mobile Toolbar and Layers as dropdowns on the same line */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            flexWrap: 'wrap'
          }} className="mobile-controls-container">
            <div style={{ flex: 1, minWidth: '120px' }}>
              <MobileToolbar />
            </div>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <MobileLayersPanel />
            </div>
          </div>

          {/* Element Settings Block - Full visibility */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              flex: 1,
              minHeight: '300px',
              border: '1px solid #e5e7eb',
              margin: '8px',
              borderRadius: '6px'
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', marginTop: 0, color: '#111827' }}>
              Настройки элемента
            </h4>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <Controls showOnlySettings={true} />
            </div>
          </div>

          {/* Preview Block - At the bottom, adaptive */}
          <div
            style={{
              backgroundColor: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              flex: 2,
              minHeight: 0,
              margin: '8px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                Превью
              </h3>
              <button
                onClick={handleClearCanvas}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                className="touch-optimized"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
                title="Очистить макет"
              >
                <Trash2 size={14} />
                Очистить
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Canvas />
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Layout */
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Блок 1: Добавить (Toolbar) - 140px */}
          <div
            style={{
              width: '140px',
              borderRight: '1px solid #e5e7eb',
              backgroundColor: '#fff',
              padding: '16px 12px',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', textAlign: 'center', marginBottom: '8px' }}>
              Добавить
            </div>
            <Toolbar />
          </div>

          {/* Блок 2: Слои - 25% */}
          <div
            style={{
              width: '25%',
              borderRight: '1px solid #e5e7eb',
              backgroundColor: '#fff',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <LayersPanel />
          </div>

          {/* Блок 3: Настройки элемента - 25% */}
          <div
            style={{
              width: '25%',
              borderRight: '1px solid #e5e7eb',
              backgroundColor: '#fff',
              overflow: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', marginTop: 0, color: '#111827' }}>
              Настройки элемента
            </h4>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <Controls showOnlySettings={true} />
            </div>
          </div>

          {/* Блок 4: Превью - треть экрана */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                Превью
              </h3>
              <button
                onClick={handleClearCanvas}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
                title="Очистить макет"
              >
                <Trash2 size={14} />
                Очистить
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Canvas />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
