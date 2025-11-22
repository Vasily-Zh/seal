import { useState, useCallback, useEffect } from 'react';
import { X, Loader, Image as ImageIcon } from 'lucide-react';
import { vectorizeImage, type VectorizeQuality, getSvgComplexity, getSvgSize, normalizeSvgFromImageTracer, getImageDimensions } from '../../utils/vectorize';
import { useStampStore } from '../../store/useStampStore';

interface VectorizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string; // Base64 изображения для конвертации
  imageElementId?: string; // ID ImageElement для замены после конвертации
}

export const VectorizeModal = ({ isOpen, onClose, imageData, imageElementId }: VectorizeModalProps) => {
  const [quality, setQuality] = useState<VectorizeQuality>('medium');
  const [colorCount, setColorCount] = useState(16);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewSvg, setPreviewSvg] = useState<string | null>(null);
  const [svgStats, setSvgStats] = useState<{ complexity: number; size: number } | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const updateElement = useStampStore((state) => state.updateElement);
  const addElement = useStampStore((state) => state.addElement);
  const canvasSize = useStampStore((state) => state.canvasSize);

  // Получаем размеры исходного изображения
  useEffect(() => {
    if (isOpen && imageData) {
      getImageDimensions(imageData)
        .then((dims) => setImageDimensions(dims))
        .catch((error) => console.error('Error getting image dimensions:', error));
    }
  }, [isOpen, imageData]);

  // Генерация превью
  const handleGeneratePreview = useCallback(async () => {
    setIsProcessing(true);
    try {
      const svg = await vectorizeImage(imageData, { quality, colorCount });
      const normalizedSvg = normalizeSvgFromImageTracer(svg);
      setPreviewSvg(normalizedSvg);
      setSvgStats({
        complexity: getSvgComplexity(normalizedSvg),
        size: getSvgSize(normalizedSvg),
      });
    } catch (error) {
      console.error('Error vectorizing image:', error);
      alert('Ошибка при векторизации изображения');
    } finally {
      setIsProcessing(false);
    }
  }, [imageData, quality, colorCount]);

  // Применить конвертацию
  const handleApply = useCallback(() => {
    if (!previewSvg) return;

    // Вычисляем размер элемента на основе исходного изображения
    let elementWidth = 20;
    let elementHeight = 20;

    if (imageDimensions) {
      const maxSize = canvasSize * 0.6; // Максимум 60% от размера холста
      const imgRatio = imageDimensions.width / imageDimensions.height;

      if (imgRatio >= 1) {
        // Ширина больше или равна высоте
        elementWidth = Math.min(imageDimensions.width / 20, maxSize); // Масштабируем из пиксели в мм
        elementHeight = elementWidth / imgRatio;
      } else {
        // Высота больше ширины
        elementHeight = Math.min(imageDimensions.height / 20, maxSize);
        elementWidth = elementHeight * imgRatio;
      }

      // Убеждаемся что размеры разумные
      elementWidth = Math.max(5, Math.min(elementWidth, maxSize));
      elementHeight = Math.max(5, Math.min(elementHeight, maxSize));
    }

    if (imageElementId) {
      // Заменяем существующий ImageElement на IconElement
      updateElement(imageElementId, {
        type: 'icon',
        iconSource: 'custom',
        svgContent: previewSvg,
        width: elementWidth,
        height: elementHeight,
      });
    } else {
      // Создаем новый IconElement
      addElement({
        id: `icon-${Date.now()}`,
        type: 'icon',
        iconName: 'vectorized',
        iconSource: 'custom',
        svgContent: previewSvg,
        x: canvasSize / 2,
        y: canvasSize / 2,
        width: elementWidth,
        height: elementHeight,
        visible: true,
      });
    }

    onClose();
  }, [previewSvg, imageElementId, imageDimensions, updateElement, addElement, canvasSize, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            zIndex: 1,
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Конвертация в SVG
          </h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Настройки */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Настройки конвертации
            </h3>

            {/* Качество */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Качество
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['low', 'medium', 'high'] as VectorizeQuality[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: quality === q ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      backgroundColor: quality === q ? '#eff6ff' : 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: quality === q ? '600' : '400',
                    }}
                  >
                    {q === 'low' && 'Низкое'}
                    {q === 'medium' && 'Среднее'}
                    {q === 'high' && 'Высокое'}
                  </button>
                ))}
              </div>
            </div>

            {/* Количество цветов */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Количество цветов: {colorCount}
              </label>
              <input
                type="range"
                min="2"
                max="64"
                step="2"
                value={colorCount}
                onChange={(e) => setColorCount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                <span>2 (быстрее)</span>
                <span>64 (больше деталей)</span>
              </div>
            </div>

            {/* Кнопка генерации превью */}
            <button
              onClick={handleGeneratePreview}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: isProcessing ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isProcessing ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Обработка...
                </>
              ) : (
                <>
                  <ImageIcon size={16} />
                  Сгенерировать превью
                </>
              )}
            </button>
          </div>

          {/* Превью */}
          {previewSvg && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Превью результата
              </h3>
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '200px',
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: previewSvg }}
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                />
              </div>

              {/* Статистика */}
              {svgStats && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#6b7280',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Элементов: {svgStats.complexity}</span>
                    <span>Размер: {svgStats.size.toFixed(1)} КБ</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Кнопки действий */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Отмена
            </button>
            <button
              onClick={handleApply}
              disabled={!previewSvg || isProcessing}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: !previewSvg || isProcessing ? '#9ca3af' : '#10b981',
                color: 'white',
                cursor: !previewSvg || isProcessing ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Применить
            </button>
          </div>

          {/* Подсказка */}
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#1e40af',
            }}
          >
            <strong>Совет:</strong> Для логотипов и печатей рекомендуется среднее качество с 8-16 цветами.
          </div>
        </div>
      </div>

      {/* CSS для анимации спиннера */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
