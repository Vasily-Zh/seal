<?php
/**
 * API для управления шаблонами
 * 
 * GET    /api/templates.php              - получить все шаблоны
 * GET    /api/templates.php?category=X   - получить шаблоны категории
 * GET    /api/templates.php?id=X         - получить один шаблон
 * POST   /api/templates.php              - создать шаблон (нужна авторизация)
 * PUT    /api/templates.php?id=X         - обновить шаблон (нужна авторизация)
 * DELETE /api/templates.php?id=X         - удалить шаблон (нужна авторизация)
 */

require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$categoryId = $_GET['category'] ?? null;

try {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            if ($id) {
                // Получить один шаблон
                $stmt = $db->prepare('SELECT * FROM templates WHERE id = ?');
                $stmt->execute([$id]);
                $template = $stmt->fetch();
                
                if (!$template) {
                    sendError('Template not found', 404);
                }
                
                // Декодируем JSON поля
                $template['elements'] = json_decode($template['elements'], true);
                $template['canvas_size'] = json_decode($template['canvas_size'], true);
                
                sendJson($template);
            } else {
                // Получить все шаблоны или по категории
                if ($categoryId) {
                    $stmt = $db->prepare('SELECT * FROM templates WHERE category_id = ? ORDER BY created_at DESC');
                    $stmt->execute([$categoryId]);
                } else {
                    $stmt = $db->query('SELECT * FROM templates ORDER BY created_at DESC');
                }
                
                $templates = $stmt->fetchAll();
                
                // Декодируем JSON поля
                foreach ($templates as &$template) {
                    $template['elements'] = json_decode($template['elements'], true);
                    $template['canvas_size'] = json_decode($template['canvas_size'], true);
                }
                
                sendJson($templates);
            }
            break;
            
        case 'POST':
            // Создать шаблон
            if (!checkAdmin()) {
                sendError('Unauthorized', 401);
            }
            
            $data = getJsonInput();
            
            if (empty($data['name'])) {
                sendError('Name is required');
            }
            
            if (empty($data['category_id'])) {
                sendError('Category ID is required');
            }
            
            if (empty($data['elements'])) {
                sendError('Elements are required');
            }
            
            $templateId = $data['id'] ?? uniqid('tpl_');
            
            $stmt = $db->prepare('
                INSERT INTO templates (id, name, category_id, elements, canvas_size, thumbnail, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            ');
            
            $stmt->execute([
                $templateId,
                $data['name'],
                $data['category_id'],
                json_encode($data['elements'], JSON_UNESCAPED_UNICODE),
                json_encode($data['canvas_size'] ?? ['width' => 400, 'height' => 400], JSON_UNESCAPED_UNICODE),
                $data['thumbnail'] ?? null
            ]);
            
            sendJson([
                'id' => $templateId,
                'name' => $data['name'],
                'category_id' => $data['category_id']
            ], 201);
            break;
            
        case 'PUT':
            // Обновить шаблон
            if (!checkAdmin()) {
                sendError('Unauthorized', 401);
            }
            
            if (!$id) {
                sendError('Template ID is required');
            }
            
            $data = getJsonInput();
            
            $fields = [];
            $values = [];
            
            if (isset($data['name'])) {
                $fields[] = 'name = ?';
                $values[] = $data['name'];
            }
            
            if (isset($data['category_id'])) {
                $fields[] = 'category_id = ?';
                $values[] = $data['category_id'];
            }
            
            if (isset($data['elements'])) {
                $fields[] = 'elements = ?';
                $values[] = json_encode($data['elements'], JSON_UNESCAPED_UNICODE);
            }
            
            if (isset($data['canvas_size'])) {
                $fields[] = 'canvas_size = ?';
                $values[] = json_encode($data['canvas_size'], JSON_UNESCAPED_UNICODE);
            }
            
            if (isset($data['thumbnail'])) {
                $fields[] = 'thumbnail = ?';
                $values[] = $data['thumbnail'];
            }
            
            if (empty($fields)) {
                sendError('No fields to update');
            }
            
            $fields[] = 'updated_at = NOW()';
            $values[] = $id;
            
            $sql = 'UPDATE templates SET ' . implode(', ', $fields) . ' WHERE id = ?';
            $stmt = $db->prepare($sql);
            $stmt->execute($values);
            
            if ($stmt->rowCount() === 0) {
                sendError('Template not found', 404);
            }
            
            sendJson(['success' => true]);
            break;
            
        case 'DELETE':
            // Удалить шаблон
            if (!checkAdmin()) {
                sendError('Unauthorized', 401);
            }
            
            if (!$id) {
                sendError('Template ID is required');
            }
            
            $stmt = $db->prepare('DELETE FROM templates WHERE id = ?');
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() === 0) {
                sendError('Template not found', 404);
            }
            
            sendJson(['success' => true]);
            break;
            
        default:
            sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}
