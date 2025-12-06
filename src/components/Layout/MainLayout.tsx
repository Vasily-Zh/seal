import { Header } from '../Header/Header';
import { Toolbar } from '../Toolbar/Toolbar';
import { MobileToolbar } from '../Toolbar/MobileToolbar';
import { Controls } from '../Controls/Controls';
import { LayersPanel } from '../Controls/LayersPanel';
import { MobileLayersPanel } from '../Controls/MobileLayersPanel';
import { Canvas } from '../Canvas/Canvas';
import { TemplateCategoryBar, TemplateGalleryPage, GeneratorPage } from '../Templates';
import { useStampStore } from '../../store/useStampStore';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { StampTemplate } from '../../types/templates';
import type { StampElement } from '../../types';

// Режимы отображения
type ViewMode = 'editor' | 'gallery' | 'generator';

export const MainLayout = () => {
  const clearCanvas = useStampStore((state) => state.clearCanvas);
  const loadProjectData = useStampStore((state) => state.loadProjectData);
  const elements = useStampStore((state) => state.elements);

  // Режим отображения
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleClearCanvas = () => {
    if (window.confirm('Вы уверены, что хотите удалить все элементы с макета?')) {
      clearCanvas();
    }
  };

  // Обработчики навигации
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setViewMode('gallery');
  };

  const handleAllTemplatesClick = () => {
    setSelectedCategoryId(null);
    setViewMode('gallery');
  };

  const handleGeneratorClick = () => {
    setViewMode('generator');
  };

  const handleBackToEditor = () => {
    setViewMode('editor');
    setSelectedCategoryId(null);
  };

  // Загрузка шаблона в редактор
  const handleSelectTemplate = (template: StampTemplate) => {
    if (elements.length > 0) {
      if (!window.confirm('Текущий макет будет заменён. Продолжить?')) {
        return;
      }
    }
    
    loadProjectData({
      elements: template.elements,
      canvasSize: template.canvasSize,
      id: '',
      name: template.name,
    });
    setViewMode('editor');
  };

  // Загрузка сгенерированного макета
  const handleSelectGenerated = (newElements: StampElement[], canvasSize: { width: number; height: number }) => {
    if (elements.length > 0) {
      if (!window.confirm('Текущий макет будет заменён. Продолжить?')) {
        return;
      }
    }
    
    loadProjectData({
      elements: newElements,
      canvasSize,
      id: '',
      name: 'Сгенерированный макет',
    });
    setViewMode('editor');
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div
      style={{
        height: '100dvh', // Динамическая высота viewport
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#f9fafb',
        // Padding снизу для панели задач Windows
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      } as const}
    >
      {/* Шапка */}
      <Header />

      {/* Карусель категорий - показываем и на мобильных */}
      {viewMode === 'editor' && (
        <TemplateCategoryBar
          onCategoryClick={handleCategoryClick}
          onAllTemplatesClick={handleAllTemplatesClick}
          onGeneratorClick={handleGeneratorClick}
        />
      )}

      {/* Режим галереи шаблонов */}
      {viewMode === 'gallery' && (
        <TemplateGalleryPage
          categoryId={selectedCategoryId}
          onBack={handleBackToEditor}
          onSelectTemplate={handleSelectTemplate}
        />
      )}

      {/* Режим генератора */}
      {viewMode === 'generator' && (
        <GeneratorPage
          onBack={handleBackToEditor}
          onSelectGenerated={handleSelectGenerated}
        />
      )}

      {/* Режим редактора */}
      {viewMode === 'editor' && (
        <>
          {/* Основной контент */}
          {isMobile ? (
        /* =================== МОБИЛЬНАЯ ВЕРСИЯ =================== */
        <div style={{ 
          flex: '1 1 auto', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          {/* Панель инструментов */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              flexWrap: 'wrap',
              flex: '0 0 auto',
            }}
            className="mobile-controls-container"
          >
            <div style={{ flex: 1, minWidth: '120px' }}>
              <MobileToolbar />
            </div>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <MobileLayersPanel />
            </div>
          </div>

          {/* Превью */}
          <div
            style={{
              flex: '0 0 auto',
              minHeight: '300px',
              height: '300px',
              backgroundColor: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              margin: '8px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: '0 0 auto',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111827' }}>
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
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
                className="touch-optimized"
              >
                <Trash2 size={14} />
                Очистить
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Canvas />
            </div>
          </div>

          {/* Настройки элемента - после превью */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '16px',
              flex: '0 0 auto',
              minHeight: '250px',
              border: '1px solid #e5e7eb',
              margin: '0 8px 8px',
              borderRadius: '6px',
              marginBottom: '20px',
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 12px 0', color: '#111827' }}>
              Настройки элемента
            </h4>
            <Controls showOnlySettings={true} />
          </div>
        </div>
      ) : (
        /* =================== ДЕСКТОПНАЯ ВЕРСИЯ =================== */
        <div style={{ flex: '1 1 auto', display: 'flex', overflow: 'hidden' }}>
          {/* Toolbar */}
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

          {/* Слои */}
          <div style={{ width: '25%', borderRight: '1px solid #e5e7eb', backgroundColor: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <LayersPanel />
          </div>

          {/* Настройки элемента */}
          <div
            style={{
              width: '25%',
              borderRight: '1px solid #e5e7eb',
              backgroundColor: '#fff',
              padding: '16px',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 12px 0', color: '#111827' }}>
              Настройки элемента
            </h4>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <Controls showOnlySettings={true} />
            </div>
          </div>

          {/* Превью */}
          <div style={{ flex: 1, backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111827' }}>
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
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
              >
                <Trash2 size={14} />
                Очистить
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Canvas />
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};