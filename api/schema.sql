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

-- ============================================
-- Примеры данных (опционально, можно не выполнять)
-- ============================================

-- INSERT INTO categories (id, name, sort_order) VALUES 
-- ('ip', 'Печати для ИП', 1),
-- ('ooo', 'Печати для ООО', 2),
-- ('medical', 'Медицинские печати', 3);
