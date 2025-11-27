import { useState } from 'react';
import { X, Package, Loader2 } from 'lucide-react';
import { downloadAutoExport } from '../../utils/autoExport';
import { useStampStore } from '../../store/useStampStore';

interface AutoExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutoExportDialog = ({ isOpen, onClose }: AutoExportDialogProps) => {
  const currentProjectName = useStampStore((state) => state.currentProjectName);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setCurrentStage('Preparation...');

    try {
      const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
      const projectName = currentProjectName || 'stamp';

      await downloadAutoExport(svgElement, {
        projectName,
        pngSize: 4000,
        onProgress: (stage, progressValue) => {
          setCurrentStage(stage);
          setProgress(progressValue);
        },
      });

      setTimeout(() => {
        onClose();
        setIsExporting(false);
        setProgress(0);
        setCurrentStage('');
      }, 500);
    } catch (error) {
      console.error('Auto-export error:', error);
      alert('An error occurred during export');
      setIsExporting(false);
      setProgress(0);
      setCurrentStage('');
    }
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
      onClick={(e) => {
        if (e.target === e.currentTarget && !isExporting) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          minWidth: '500px',
          maxWidth: '600px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Package size={24} color="#3b82f6" />
            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
              Auto Export
            </h2>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} color="#6b7280" />
            </button>
          )}
        </div>

        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
          }}
        >
          <p style={{ margin: 0, color: '#374151', lineHeight: '1.6' }}>
            <strong>ZIP archive will contain:</strong>
          </p>
          <ul style={{ margin: '12px 0 0 0', paddingLeft: '20px', color: '#6b7280' }}>
            <li>PNG with background (4000x4000)</li>
            <li>PNG with transparency (4000x4000)</li>
            <li>SVG vectorized via Potrace (for CorelDRAW)</li>
            <li>SVG original (editable)</li>
            <li>PDF document</li>
          </ul>
        </div>

        {isExporting && (
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {currentStage}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>
                {progress}%
              </span>
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
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={isExporting}
            style={{
              padding: '10px 20px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              opacity: isExporting ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: isExporting ? '#93c5fd' : '#3b82f6',
              color: 'white',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isExporting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {isExporting ? 'Exporting...' : 'Start Export'}
          </button>
        </div>

        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};
