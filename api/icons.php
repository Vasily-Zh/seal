<?php
/**
 * API для управления тегами иконок
 * 
 * GET    /api/icons.php                  - получить все теги иконок
 * GET    /api/icons.php?name=X           - получить теги одной иконки
 * POST   /api/icons.php                  - установить теги иконки (нужна авторизация)
 * DELETE /api/icons.php?name=X           - удалить теги иконки (нужна авторизация)
 */

require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$iconName = $_GET['name'] ?? null;

try {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            if ($iconName) {
                // Получить теги одной иконки
                $stmt = $db->prepare('SELECT * FROM icon_tags WHERE icon_name = ?');
                $stmt->execute([$iconName]);
                $icon = $stmt->fetch();
                
                if (!$icon) {
                    sendJson(['icon_name' => $iconName, 'tags' => []]);
                } else {
                    $icon['tags'] = json_decode($icon['tags'], true);
                    sendJson($icon);
                }
            } else {
                // Получить все теги
                $stmt = $db->query('SELECT * FROM icon_tags ORDER BY icon_name');
                $icons = $stmt->fetchAll();
                
                // Преобразуем в объект icon_name => tags
                $result = [];
                foreach ($icons as $icon) {
                    $result[$icon['icon_name']] = json_decode($icon['tags'], true);
                }
                
                sendJson($result);
            }
            break;
            
        case 'POST':
            // Установить теги иконки
            if (!checkAdmin()) {
                sendError('Unauthorized', 401);
            }
            
            $data = getJsonInput();
            
            if (empty($data['icon_name'])) {
                sendError('Icon name is required');
            }
            
            $tags = $data['tags'] ?? [];
            
            if (!is_array($tags)) {
                sendError('Tags must be an array');
            }
            
            // Используем REPLACE для upsert
            $stmt = $db->prepare('
                REPLACE INTO icon_tags (icon_name, tags)
                VALUES (?, ?)
            ');
            
            $stmt->execute([
                $data['icon_name'],
                json_encode($tags, JSON_UNESCAPED_UNICODE)
            ]);
            
            sendJson([
                'success' => true,
                'icon_name' => $data['icon_name'],
                'tags' => $tags
            ]);
            break;
            
        case 'DELETE':
            // Удалить теги иконки
            if (!checkAdmin()) {
                sendError('Unauthorized', 401);
            }
            
            if (!$iconName) {
                sendError('Icon name is required');
            }
            
            $stmt = $db->prepare('DELETE FROM icon_tags WHERE icon_name = ?');
            $stmt->execute([$iconName]);
            
            sendJson(['success' => true]);
            break;
            
        default:
            sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}
