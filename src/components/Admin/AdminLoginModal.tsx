import { useState, useEffect } from 'react';
import { setAdminToken, clearAdminToken, hasAdminToken } from '../../utils/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (needsPasswordChange: boolean) => void;
}

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(false);

  // Проверяем сохранённую сессию при открытии
  useEffect(() => {
    if (isOpen && hasAdminToken()) {
      checkSavedSession();
    }
  }, [isOpen]);

  const checkSavedSession = async () => {
    setIsCheckingSession(true);
    const savedToken = localStorage.getItem('admin_token');
    
    try {
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedToken}`,
        },
        body: JSON.stringify({ action: 'check' }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Сессия валидна, сразу входим
        onLoginSuccess(false);
        onClose();
      }
    } catch (err) {
      // Сессия невалидна, покажем форму входа
      console.error('Session check failed:', err);
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Очистка формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Проверяем пароль через тестовое создание/удаление
      // Используем специальный эндпоинт для проверки авторизации
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`,
        },
        body: JSON.stringify({ action: 'check' }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Пароль верный - сохраняем токен
        setAdminToken(password);
        onLoginSuccess(false);
        onClose();
      } else {
        setError('Неверный пароль');
        clearAdminToken();
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Обработчик клика на оверлей - закрываем только если кликнули именно на оверлей
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
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
      onClick={handleOverlayClick}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '400px',
          maxWidth: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Вход администратора</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              color: '#666',
            }}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {isCheckingSession ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
            Проверка авторизации...
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="login-password"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#333',
              }}
            >
              Пароль администратора
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              placeholder="Введите пароль"
              autoComplete="current-password"
              autoFocus
              required
            />
          </div>

          {error && (
            <div
              style={{
                padding: '10px',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#3b82f6',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: isLoading ? 0.6 : 1,
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Проверка...' : 'Войти'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
