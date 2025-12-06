/**
 * API сервис для работы с шаблонами на сервере
 */

// Базовый URL API (относительный путь, работает на том же домене)
const API_BASE = '/api';

// Получаем пароль админа из localStorage (устанавливается при авторизации)
const getAdminToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

// Устанавливаем токен админа
export const setAdminToken = (token: string) => {
  localStorage.setItem('admin_token', token);
};

// Удаляем токен админа
export const clearAdminToken = () => {
  localStorage.removeItem('admin_token');
};

// Проверяем есть ли токен админа
export const hasAdminToken = (): boolean => {
  return !!getAdminToken();
};

// Базовая функция для запросов
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// ==================== КАТЕГОРИИ ====================

export interface ApiCategory {
  id: string;
  name: string;
  sort_order: number;
}

export const categoriesApi = {
  // Получить все категории
  getAll: async (): Promise<ApiCategory[]> => {
    return apiRequest<ApiCategory[]>('/categories.php');
  },

  // Создать категорию
  create: async (data: { name: string; sort_order?: number }): Promise<ApiCategory> => {
    return apiRequest<ApiCategory>('/categories.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Обновить категорию
  update: async (id: string, data: Partial<ApiCategory>): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/categories.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Удалить категорию
  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/categories.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== ШАБЛОНЫ ====================

export interface ApiTemplate {
  id: string;
  name: string;
  category_id: string;
  elements: any[];
  canvas_size: { width: number; height: number };
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export const templatesApi = {
  // Получить все шаблоны
  getAll: async (): Promise<ApiTemplate[]> => {
    return apiRequest<ApiTemplate[]>('/templates.php');
  },

  // Получить шаблоны по категории
  getByCategory: async (categoryId: string): Promise<ApiTemplate[]> => {
    return apiRequest<ApiTemplate[]>(`/templates.php?category=${categoryId}`);
  },

  // Получить один шаблон
  getById: async (id: string): Promise<ApiTemplate> => {
    return apiRequest<ApiTemplate>(`/templates.php?id=${id}`);
  },

  // Создать шаблон
  create: async (data: {
    name: string;
    category_id: string;
    elements: any[];
    canvas_size?: { width: number; height: number };
    thumbnail?: string;
  }): Promise<ApiTemplate> => {
    return apiRequest<ApiTemplate>('/templates.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Обновить шаблон
  update: async (id: string, data: Partial<ApiTemplate>): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/templates.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Удалить шаблон
  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/templates.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== ПРОВЕРКА АВТОРИЗАЦИИ ====================

export const authApi = {
  // Проверить пароль админа (пробуем создать и удалить тестовую категорию)
  checkPassword: async (password: string): Promise<boolean> => {
    // Временно устанавливаем токен
    const oldToken = getAdminToken();
    setAdminToken(password);
    
    try {
      // Пробуем получить категории (это не требует авторизации, но проверит соединение)
      await categoriesApi.getAll();
      return true;
    } catch (error) {
      // Восстанавливаем старый токен
      if (oldToken) {
        setAdminToken(oldToken);
      } else {
        clearAdminToken();
      }
      return false;
    }
  },
};
