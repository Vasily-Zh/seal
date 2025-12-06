/**
 * Утилиты для авторизации администратора
 * Использует Web Crypto API для хэширования паролей через SHA-256
 */

// Ключи для хранения
const ADMIN_CREDENTIALS_KEY = 'adminCredentials';
const ADMIN_SESSION_KEY = 'isAdminLoggedIn';
const DEFAULT_LOGIN = 'admin';
const DEFAULT_PASSWORD = 'admin123';

export interface AdminCredentials {
  login: string;
  passwordHash: string;
  createdAt: number;
  needsPasswordChange: boolean; // флаг для принудительной смены дефолтного пароля
}

/**
 * Хэширование пароля через SHA-256
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Проверка пароля (сравнение хэшей)
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Инициализация дефолтных креденшалов при первом запуске
 */
export async function initializeDefaultAdmin(): Promise<void> {
  const existing = loadAdminCredentials();
  if (!existing) {
    const defaultHash = await hashPassword(DEFAULT_PASSWORD);
    const credentials: AdminCredentials = {
      login: DEFAULT_LOGIN,
      passwordHash: defaultHash,
      createdAt: Date.now(),
      needsPasswordChange: true, // требуется смена при первом входе
    };
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(credentials));
  }
}

/**
 * Загрузка креденшалов из localStorage
 */
export function loadAdminCredentials(): AdminCredentials | null {
  try {
    const data = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!data) return null;
    return JSON.parse(data) as AdminCredentials;
  } catch (error) {
    console.error('Ошибка загрузки креденшалов:', error);
    return null;
  }
}

/**
 * Сохранение креденшалов в localStorage
 */
export function saveAdminCredentials(credentials: AdminCredentials): void {
  localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(credentials));
}

/**
 * Проверка, залогинен ли администратор
 * Проверяет наличие токена API в localStorage
 */
export function isAdminLoggedIn(): boolean {
  return !!localStorage.getItem('admin_token');
}

/**
 * Вход администратора
 * @returns { success: boolean, needsPasswordChange: boolean, error?: string }
 */
export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; needsPasswordChange: boolean; error?: string }> {
  const credentials = loadAdminCredentials();

  if (!credentials) {
    return { success: false, needsPasswordChange: false, error: 'Администратор не инициализирован' };
  }

  if (credentials.login !== username) {
    return { success: false, needsPasswordChange: false, error: 'Неверный логин' };
  }

  const isPasswordValid = await verifyPassword(password, credentials.passwordHash);

  if (!isPasswordValid) {
    return { success: false, needsPasswordChange: false, error: 'Неверный пароль' };
  }

  // Устанавливаем флаг сессии
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');

  return {
    success: true,
    needsPasswordChange: credentials.needsPasswordChange,
  };
}

/**
 * Выход администратора
 */
export function logout(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

/**
 * Смена логина и/или пароля
 */
export async function changeCredentials(
  currentPassword: string,
  newLogin?: string,
  newPassword?: string
): Promise<{ success: boolean; error?: string }> {
  const credentials = loadAdminCredentials();

  if (!credentials) {
    return { success: false, error: 'Креденшалы не найдены' };
  }

  // Проверяем текущий пароль
  const isPasswordValid = await verifyPassword(currentPassword, credentials.passwordHash);

  if (!isPasswordValid) {
    return { success: false, error: 'Неверный текущий пароль' };
  }

  // Обновляем креденшалы
  const updatedCredentials: AdminCredentials = { ...credentials };

  if (newLogin && newLogin.trim() !== '') {
    updatedCredentials.login = newLogin.trim();
  }

  if (newPassword && newPassword.trim() !== '') {
    updatedCredentials.passwordHash = await hashPassword(newPassword);
    updatedCredentials.needsPasswordChange = false; // сбрасываем флаг принудительной смены
  }

  saveAdminCredentials(updatedCredentials);

  return { success: true };
}

/**
 * Сброс креденшалов к дефолтным значениям
 */
export async function resetToDefault(): Promise<void> {
  localStorage.removeItem(ADMIN_CREDENTIALS_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  await initializeDefaultAdmin();
}

/**
 * Получить текущий логин администратора
 */
export function getCurrentAdminLogin(): string | null {
  const credentials = loadAdminCredentials();
  return credentials ? credentials.login : null;
}
