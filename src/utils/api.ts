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

// ==================== АВТОРИЗАЦИЯ ====================

export const authApi = {
  // Проверить пароль
  check: async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`,
        },
        body: JSON.stringify({ action: 'check' }),
      });
      
      const data = await response.json();
      return response.ok && data.success;
    } catch {
      return false;
    }
  },

  // Сменить пароль
  changePassword: async (newPassword: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>('/auth.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'change', newPassword }),
    });
  },
};

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

// ==================== ГЕНЕРАТОР ШАБЛОНОВ ====================

export interface ApiGeneratorTemplate {
  id: string;
  name: string;
  type: 'ip' | 'ooo' | 'medical' | 'selfemployed' | 'custom';
  elements: any[];
  canvas_size: { width: number; height: number };
  icon_position: { x: number; y: number; size: number };
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export const generatorApi = {
  // Получить все шаблоны генератора
  getAll: async (): Promise<ApiGeneratorTemplate[]> => {
    return apiRequest<ApiGeneratorTemplate[]>('/generator.php');
  },

  // Получить один шаблон
  getById: async (id: string): Promise<ApiGeneratorTemplate> => {
    return apiRequest<ApiGeneratorTemplate>(`/generator.php?id=${id}`);
  },

  // Создать шаблон
  create: async (data: {
    name: string;
    type?: string;
    elements: any[];
    canvas_size?: { width: number; height: number };
    icon_position?: { x: number; y: number; size: number };
    thumbnail?: string;
  }): Promise<ApiGeneratorTemplate> => {
    return apiRequest<ApiGeneratorTemplate>('/generator.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Обновить шаблон
  update: async (id: string, data: Partial<ApiGeneratorTemplate>): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/generator.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Удалить шаблон
  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/generator.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== ТЕГИ ИКОНОК ====================

export const iconsApi = {
  // Получить все теги иконок
  getAll: async (): Promise<Record<string, string[]>> => {
    return apiRequest<Record<string, string[]>>('/icons.php');
  },

  // Получить теги одной иконки
  getByName: async (iconName: string): Promise<{ icon_name: string; tags: string[] }> => {
    return apiRequest<{ icon_name: string; tags: string[] }>(`/icons.php?name=${encodeURIComponent(iconName)}`);
  },

  // Установить теги иконки
  setTags: async (iconName: string, tags: string[]): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>('/icons.php', {
      method: 'POST',
      body: JSON.stringify({ icon_name: iconName, tags }),
    });
  },

  // Удалить теги иконки
  delete: async (iconName: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/icons.php?name=${encodeURIComponent(iconName)}`, {
      method: 'DELETE',
    });
  },
};
