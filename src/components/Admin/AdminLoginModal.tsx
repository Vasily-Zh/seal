import { useState, useEffect } from 'react';
import { login, initializeDefaultAdmin } from '../../utils/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (needsPasswordChange: boolean) => void;
}

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Инициализация дефолтного админа при монтировании компонента
  useEffect(() => {
    initializeDefaultAdmin();
  }, []);

  // Очистка формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        onLoginSuccess(result.needsPasswordChange);
        onClose();
      } else {
        setError(result.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Произошла ошибка при входе');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
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
        zIndex: 1000,
      }}
      onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="login-username"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#333',
              }}
            >
              Логин
            </label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              placeholder="Введите логин"
              autoComplete="username"
              required
            />
          </div>

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
              Пароль
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

          <div
            style={{
              padding: '12px',
              backgroundColor: '#f0f9ff',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#1e40af',
            }}
          >
            <strong>По умолчанию:</strong> логин <code>admin</code>, пароль <code>admin123</code>
          </div>

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
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
