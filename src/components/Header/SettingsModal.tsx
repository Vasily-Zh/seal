import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
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
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          width: '90%',
          maxWidth: 600,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111827' }}>
            Настройки конструктора
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 24,
          }}
        >
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <p style={{ margin: 0, fontSize: 14 }}>
              Функционал настроек находится в разработке.
            </p>
            <p style={{ margin: '8px 0 0', fontSize: 14 }}>
              Здесь вы сможете настраивать различные параметры конструктора,
              загружать custom SVG иконки, и управлять другими параметрами.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
