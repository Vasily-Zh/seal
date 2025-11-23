import { X, Upload, ShieldCheck, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStampStore } from '../../store/useStampStore';
import { applySvgStyles } from '../../utils/extractSvgFromIcon';
import { isAdminLoggedIn } from '../../utils/auth';
import { AdminLoginModal } from '../Admin/AdminLoginModal';
import { AdminPanel } from '../Admin/AdminPanel';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const addElement = useStampStore((state) => state.addElement);
  const canvasSize = useStampStore((state) => state.canvasSize);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);

  // Проверяем статус авторизации при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setIsLoggedIn(isAdminLoggedIn());
    }
  }, [isOpen]);

  const handleLoginSuccess = (needsChange: boolean) => {
    setIsLoggedIn(true);
    setNeedsPasswordChange(needsChange);
    setIsLoginModalOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleOpenAdminPanel = () => {
    if (isLoggedIn) {
      setIsAdminPanelOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleSvgUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.svg,image/svg+xml';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const svgContent = event.target?.result as string;
            // Применяем синий цвет
            const styledSvg = applySvgStyles(svgContent, { fill: '#0000ff' });

            // Добавляем на канвас
            addElement({
              id: `icon-${Date.now()}`,
              type: 'icon',
              iconName: 'custom-svg',
              iconSource: 'custom',
              svgContent: styledSvg,
              x: canvasSize / 2,
              y: canvasSize / 2,
              width: 20,
              height: 20,
              visible: true,
              fill: '#0000ff',
            });

            onClose();
          } catch (error) {
            console.error('Error loading SVG:', error);
            alert('Ошибка при загрузке SVG файла');
          } finally {
            setIsUploading(false);
          }
        };
        reader.onerror = () => {
          alert('Ошибка при чтении файла');
          setIsUploading(false);
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
          {/* Загрузка SVG */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#111827' }}>
              Загрузка своего SVG
            </h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
              Загрузите свой SVG файл. Он будет автоматически добавлен на канвас с синей заливкой.
            </p>
            <button
              onClick={handleSvgUpload}
              disabled={isUploading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: isUploading ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: isUploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Upload size={18} />
              {isUploading ? 'Загрузка...' : 'Загрузить SVG файл'}
            </button>
          </div>

          {/* Админ-панель */}
          <div style={{ marginBottom: 24, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#111827' }}>
              Управление SVG-библиотекой
            </h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
              {isLoggedIn
                ? 'Вы авторизованы как администратор. Управляйте категориями и загружайте SVG в общую библиотеку.'
                : 'Войдите как администратор для управления категориями и SVG-файлами.'}
            </p>
            <button
              onClick={handleOpenAdminPanel}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: isLoggedIn ? '#3b82f6' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {isLoggedIn ? (
                <>
                  <ShieldCheck size={18} />
                  Открыть админ-панель
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Войти как администратор
                </>
              )}
            </button>
          </div>

          {/* Информация */}
          <div
            style={{
              padding: 16,
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 8,
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px 0', color: '#1e40af' }}>
              Информация о загрузке SVG
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#1e40af' }}>
              <li>Поддерживаются только .svg файлы</li>
              <li>SVG автоматически получит синюю заливку (#0000ff)</li>
              <li>Файл будет добавлен на канвас в центре</li>
              <li>После добавления вы можете изменить размер и позицию</li>
            </ul>
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

      {/* Модальное окно логина */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Админ-панель */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => {
          setIsAdminPanelOpen(false);
          setIsLoggedIn(isAdminLoggedIn()); // Обновляем статус
        }}
        needsPasswordChange={needsPasswordChange}
      />
    </div>
  );
};
