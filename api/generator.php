<?php
/**
 * API для управления базовыми шаблонами генератора
 * 
 * GET    /api/generator.php              - получить все шаблоны генератора
 * GET    /api/generator.php?id=X         - получить один шаблон
 * POST   /api/generator.php              - создать шаблон (нужна авторизация)
 * PUT    /api/generator.php?id=X         - обновить шаблон (нужна авторизация)
 * DELETE /api/generator.php?id=X         - удалить шаблон (нужна авторизация)
 */

require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

try {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            if ($id) {
                // Получить один шаблон
                $stmt = $db->prepare('SELECT * FROM generator_templates WHERE id = ?');
                $stmt->execute([$id]);
                $template = $stmt->fetch();
                
                if (!$template) {
                    sendError('Template not found', 404);
                }
                
                // Декодируем JSON поля
                $template['elements'] = json_decode($template['elements'], true);
                $template['canvas_size'] = json_decode($template['canvas_size'], true);
                $template['icon_position'] = json_decode($template['icon_position'], true);
                
                sendJson($template);
            } else {
                // Получить все шаблоны
                $stmt = $db->query('SELECT * FROM generator_templates ORDER BY created_at DESC');
                $templates = $stmt->fetchAll();
                
                // Декодируем JSON поля
                foreach ($templates as &$template) {
                    $template['elements'] = json_decode($template['elements'], true);
                    $template['canvas_size'] = json_decode($template['canvas_size'], true);
                    $template['icon_position'] = json_decode($template['icon_position'], true);
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
            
            if (empty($data['elements'])) {
                sendError('Elements are required');
            }
            
            $templateId = $data['id'] ?? uniqid('gen_');
            
            $stmt = $db->prepare('
                INSERT INTO generator_templates (id, name, type, elements, canvas_size, icon_position, thumbnail)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ');
            
            $stmt->execute([
                $templateId,
                $data['name'],
                $data['type'] ?? 'custom',
                json_encode($data['elements'], JSON_UNESCAPED_UNICODE),
                json_encode($data['canvas_size'] ?? ['width' => 400, 'height' => 400], JSON_UNESCAPED_UNICODE),
                json_encode($data['icon_position'] ?? ['x' => 50, 'y' => 50, 'size' => 15], JSON_UNESCAPED_UNICODE),
                $data['thumbnail'] ?? null
            ]);
            
            sendJson([
                'id' => $templateId,
                'name' => $data['name'],
                'type' => $data['type'] ?? 'custom'
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
            
            if (isset($data['type'])) {
                $fields[] = 'type = ?';
                $values[] = $data['type'];
            }
            
            if (isset($data['elements'])) {
                $fields[] = 'elements = ?';
                $values[] = json_encode($data['elements'], JSON_UNESCAPED_UNICODE);
            }
            
            if (isset($data['canvas_size'])) {
                $fields[] = 'canvas_size = ?';
                $values[] = json_encode($data['canvas_size'], JSON_UNESCAPED_UNICODE);
            }
            
            if (isset($data['icon_position'])) {
                $fields[] = 'icon_position = ?';
                $values[] = json_encode($data['icon_position'], JSON_UNESCAPED_UNICODE);
            }
            
            if (isset($data['thumbnail'])) {
                $fields[] = 'thumbnail = ?';
                $values[] = $data['thumbnail'];
            }
            
            if (empty($fields)) {
                sendError('No fields to update');
            }
            
            $values[] = $id;
            
            $sql = 'UPDATE generator_templates SET ' . implode(', ', $fields) . ' WHERE id = ?';
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
            
            $stmt = $db->prepare('DELETE FROM generator_templates WHERE id = ?');
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
