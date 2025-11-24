import { useState } from 'react';
import { X, Upload, Image as ImageIcon, Wand2 } from 'lucide-react';
import { useStampStore } from '../../store/useStampStore';
import {
  vectorizeImage,
  vectorizeWithPotrace,
  isImageSuitableForPotrace,
  loadImageAsBase64,
  type VectorizeQuality,
  type PotraceOptions,
} from '../../utils/vectorize';
import { applySvgStyles } from '../../utils/extractSvgFromIcon';

interface VectorizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type VectorizationMethod = 'imagetracer' | 'potrace';

export const VectorizationDialog = ({ isOpen, onClose }: VectorizationDialogProps) => {
  const addElement = useStampStore((state) => state.addElement);
  const canvasSize = useStampStore((state) => state.canvasSize);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [method, setMethod] = useState<VectorizationMethod>('imagetracer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuitableForPotrace, setIsSuitableForPotrace] = useState<boolean | null>(null);

  // Настройки для ImageTracer
  const [quality, setQuality] = useState<VectorizeQuality>('high');
  const [colorCount, setColorCount] = useState<number>(16);

  // Настройки для Potrace
  const [threshold, setThreshold] = useState<number>(128);
  const [turdSize, setTurdSize] = useState<number>(2);
  const [potraceColor, setPotraceColor] = useState<string>('#0000ff');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Создаём превью
    const reader = new FileReader();
    reader.onload = async (event) => {
      const url = event.target?.result as string;
      setPreviewUrl(url);

      // Проверяем, подходит ли изображение для Potrace
      const suitable = await isImageSuitableForPotrace(url);
      setIsSuitableForPotrace(suitable);

      // Автоматически выбираем метод если изображение подходит для Potrace
      if (suitable) {
        setMethod('potrace');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVectorize = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsProcessing(true);

    try {
      const base64 = await loadImageAsBase64(selectedFile);
      let svg: string;

      if (method === 'imagetracer') {
        // Векторизация через ImageTracer
        svg = await vectorizeImage(base64, { quality, colorCount });
      } else {
        // Векторизация через Potrace
        const potraceOptions: PotraceOptions = {
          threshold,
          turdSize,
          optCurve: true,
          color: potraceColor,
        };
        svg = await vectorizeWithPotrace(base64, potraceOptions);
      }

      // Применяем стили если используется Potrace
      const styledSvg = method === 'potrace'
        ? applySvgStyles(svg, { fill: potraceColor })
        : svg;

      // Добавляем элемент на холст
      addElement({
        id: `icon-${Date.now()}`,
        type: 'icon',
        iconName: 'vectorized',
        iconSource: 'custom',
        svgContent: styledSvg,
        x: canvasSize / 2,
        y: canvasSize / 2,
        width: 20,
        height: 20,
        fill: method === 'potrace' ? potraceColor : undefined,
        visible: true,
      });

      // Закрываем диалог
      onClose();
      resetState();
    } catch (error) {
      console.error('Vectorization error:', error);
      alert(`Ошибка векторизации: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setMethod('imagetracer');
    setIsSuitableForPotrace(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

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
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
            Векторизация изображения
          </h2>
          <button
            onClick={handleClose}
            style={{
              padding: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '6px',
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* File Upload */}
        {!previewUrl ? (
          <div
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={() => document.getElementById('vectorize-file-input')?.click()}
          >
            <Upload size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#374151', fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
              Загрузите изображение
            </p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Поддерживаются PNG, JPG, JPEG
            </p>
            <input
              id="vectorize-file-input"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <>
            {/* Preview */}
            <div
              style={{
                marginBottom: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9fafb',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <ImageIcon size={20} color="#6b7280" />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {selectedFile?.name}
                </span>
              </div>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  display: 'block',
                  margin: '0 auto',
                  borderRadius: '6px',
                }}
              />
            </div>

            {/* Рекомендация по методу */}
            {isSuitableForPotrace !== null && (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: isSuitableForPotrace ? '#dbeafe' : '#fef3c7',
                  border: `1px solid ${isSuitableForPotrace ? '#93c5fd' : '#fcd34d'}`,
                  marginBottom: '20px',
                }}
              >
                <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
                  {isSuitableForPotrace
                    ? '✓ Изображение подходит для Potrace (ч/б логотип)'
                    : 'ℹ Для цветных изображений лучше использовать ImageTracer'}
                </p>
              </div>
            )}

            {/* Выбор метода */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Метод векторизации
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setMethod('imagetracer')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: method === 'imagetracer' ? '2px solid #3b82f6' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: method === 'imagetracer' ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  ImageTracer
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Цветные изображения</div>
                </button>
                <button
                  onClick={() => setMethod('potrace')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: method === 'potrace' ? '2px solid #3b82f6' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: method === 'potrace' ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Potrace
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Ч/Б логотипы</div>
                </button>
              </div>
            </div>

            {/* Настройки ImageTracer */}
            {method === 'imagetracer' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Качество
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as VectorizeQuality)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    marginBottom: '12px',
                  }}
                >
                  <option value="low">Низкое (быстро)</option>
                  <option value="medium">Среднее</option>
                  <option value="high">Высокое (медленно)</option>
                </select>

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Количество цветов: {colorCount}
                </label>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="4"
                  value={colorCount}
                  onChange={(e) => setColorCount(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {/* Настройки Potrace */}
            {method === 'potrace' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Порог (threshold): {threshold}
                </label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: '12px' }}
                />

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Фильтр деталей (turdSize): {turdSize}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={turdSize}
                  onChange={(e) => setTurdSize(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: '12px' }}
                />

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Цвет
                </label>
                <input
                  type="color"
                  value={potraceColor}
                  onChange={(e) => setPotraceColor(e.target.value)}
                  style={{ width: '100%', height: '40px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleVectorize}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: isProcessing ? '#9ca3af' : '#10b981',
                  color: 'white',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Wand2 size={16} />
                {isProcessing ? 'Векторизация...' : 'Векторизовать'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
