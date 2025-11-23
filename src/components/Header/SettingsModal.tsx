import { X, ShieldCheck, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isAdminLoggedIn } from '../../utils/auth';
import { AdminLoginModal } from '../Admin/AdminLoginModal';
import { AdminPanel } from '../Admin/AdminPanel';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
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
          {/* Админ-панель */}
          <div style={{ marginBottom: 24 }}>
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
