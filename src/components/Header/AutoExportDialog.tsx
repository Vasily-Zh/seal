import { useState } from 'react';
import { X, Download, Settings, FileImage, FileText, Package } from 'lucide-react';
import { autoExportProject } from '../../utils/export';
import type { AutoExportOptions } from '../../utils/export';
import { useStampStore } from '../../store/useStampStore';

interface AutoExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutoExportDialog = ({ isOpen, onClose }: AutoExportDialogProps) => {
  const elements = useStampStore((state) => state.elements);
  const currentProjectName = useStampStore((state) => state.currentProjectName);
  
  const [options, setOptions] = useState<AutoExportOptions>({
    vectorizeText: true,
    includePNG: true,
    includeTransparentPNG: true,
    includePDF: true,
    includeVectorizedSVG: true,
    includeOriginalSVG: true,
    filename: '',
    maxSize: 4000,
    quality: 'high'
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setProgressMessage('Подготовка экспорта...');
    
    try {
      const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
      
      await autoExportProject(
        svgElement,
        elements,
        currentProjectName || undefined,
        options,
        (progressValue, message) => {
          setProgress(progressValue);
          setProgressMessage(message);
        }
      );
      
      onClose();
      alert('Экспорт успешно завершен!');
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Ошибка экспорта: ${error}`);
    } finally {
      setIsExporting(false);
      setProgress(0);
      setProgressMessage('');
    }
  };

  const handleOptionChange = <K extends keyof AutoExportOptions>(
    key: K,
    value: AutoExportOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

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
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          width: '500px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* Заголовок */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Package style={{ marginRight: '12px', color: '#3b82f6' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
            Автоматический экспорт
          </h2>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Прогресс экспорта */}
        {isExporting && (
          <div
            style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Download size={16} style={{ marginRight: '8px', color: '#3b82f6' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{progressMessage}</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#3b82f6',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              {progress}% выполнено
            </div>
          </div>
        )}

        {/* Настройки */}
        {!isExporting && (
          <>
            {/* Имя файла */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
              >
                Имя файла (опционально)
              </label>
              <input
                type="text"
                value={options.filename}
                onChange={(e) => handleOptionChange('filename', e.target.value)}
                placeholder={currentProjectName || 'project_name'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Форматы файлов */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Форматы файлов
              </h3>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={options.includePNG}
                    onChange={(e) => handleOptionChange('includePNG', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <FileImage size={16} style={{ marginRight: '8px', color: '#10b981' }} />
                  PNG с фоном
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={options.includeTransparentPNG}
                    onChange={(e) => handleOptionChange('includeTransparentPNG', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <FileImage size={16} style={{ marginRight: '8px', color: '#10b981' }} />
                  PNG прозрачный
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={options.includePDF}
                    onChange={(e) => handleOptionChange('includePDF', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <FileText size={16} style={{ marginRight: '8px', color: '#dc2626' }} />
                  PDF документ
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={options.includeVectorizedSVG}
                    onChange={(e) => handleOptionChange('includeVectorizedSVG', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <FileText size={16} style={{ marginRight: '8px', color: '#7c3aed' }} />
                  SVG векторизованный
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={options.includeOriginalSVG}
                    onChange={(e) => handleOptionChange('includeOriginalSVG', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <FileText size={16} style={{ marginRight: '8px', color: '#7c3aed' }} />
                  SVG оригинальный
                </label>
              </div>
            </div>

            {/* Векторизация */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Векторизация
              </h3>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={options.vectorizeText}
                    onChange={(e) => handleOptionChange('vectorizeText', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <Settings size={16} style={{ marginRight: '8px', color: '#f59e0b' }} />
                  Векторизовать текст в SVG
                </label>
                
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px',
                    }}
                  >
                    Качество векторизации
                  </label>
                  <select
                    value={options.quality}
                    onChange={(e) => handleOptionChange('quality', e.target.value as 'high' | 'medium' | 'low')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="high">Высокое (медленно, лучше качество)</option>
                    <option value="medium">Среднее</option>
                    <option value="low">Низкое (быстро)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Размеры */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
              >
                Максимальный размер PNG (пиксели)
              </label>
              <input
                type="number"
                value={options.maxSize}
                onChange={(e) => handleOptionChange('maxSize', parseInt(e.target.value) || 4000)}
                min="1000"
                max="8000"
                step="500"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Рекомендуется: 4000px для печати высокого качества
              </div>
            </div>

            {/* Кнопки */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                disabled={isExporting}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                }}
              >
                Отмена
              </button>
              
              <button
                onClick={handleExport}
                disabled={isExporting || (!options.includePNG && !options.includeTransparentPNG && !options.includePDF && !options.includeVectorizedSVG && !options.includeOriginalSVG)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: isExporting || (!options.includePNG && !options.includeTransparentPNG && !options.includePDF && !options.includeVectorizedSVG && !options.includeOriginalSVG) ? '#9ca3af' : '#10b981',
                  color: 'white',
                  cursor: isExporting || (!options.includePNG && !options.includeTransparentPNG && !options.includePDF && !options.includeVectorizedSVG && !options.includeOriginalSVG) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download size={16} />
                {isExporting ? 'Экспорт...' : 'Начать экспорт'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};