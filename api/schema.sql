-- ============================================
-- SQL для создания таблиц на Beget
-- Выполни этот скрипт в phpMyAdmin
-- ============================================

-- Таблица категорий
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица шаблонов
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    elements JSON NOT NULL,
    canvas_size JSON DEFAULT NULL,
    thumbnail LONGTEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category_id),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица базовых шаблонов для генератора
CREATE TABLE IF NOT EXISTS generator_templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('ip', 'ooo', 'medical', 'selfemployed', 'custom') NOT NULL DEFAULT 'custom',
    elements JSON NOT NULL,
    canvas_size JSON DEFAULT NULL,
    icon_position JSON DEFAULT NULL,
    thumbnail LONGTEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица тегов иконок
CREATE TABLE IF NOT EXISTS icon_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icon_name VARCHAR(255) NOT NULL,
    tags JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_icon (icon_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Категории по умолчанию
-- ============================================

INSERT INTO categories (id, name, sort_order) VALUES 
('ip', 'Печати для ИП', 1),
('ooo', 'Печати для ООО', 2),
('medical', 'Медицинские печати', 3),
('samzan', 'Печати самозанятых', 4)
ON DUPLICATE KEY UPDATE name = VALUES(name), sort_order = VALUES(sort_order);
