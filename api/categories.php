<?php
/**
 * API для управления категориями шаблонов
 * 
 * GET    /api/categories.php          - получить все категории
 * POST   /api/categories.php          - создать категорию (нужна авторизация)
 * PUT    /api/categories.php?id=X     - обновить категорию (нужна авторизация)
 * DELETE /api/categories.php?id=X     - удалить категорию (нужна авторизация)
 */

require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

try {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            // Получить все категории
            $stmt = $db->query('SELECT * FROM categories ORDER BY sort_order ASC, id ASC');
            $categories = $stmt->fetchAll();
            sendJson($categories);
            break;
            
        case 'POST':
            // Создать категорию
            if (!checkAdmin()) {
                sendError('Unauthorized', 401);
            }
            
            $data = getJsonInput();
            
            if (empty($data['name'])) {
                sendError('Name is required');
            }
            
            $stmt = $db->prepare('INSERT INTO categories (id, name, sort_order) VALUES (?, ?, ?)');
            $categoryId = $data['id'] ?? uniqid('cat_');
            $stmt->execute([
                $categoryId,
                $data['name'],
                $data['sort_order'] ?? 0
            ]);
            
            sendJson([
                'id' => $categoryId,
                'name' => $data['name'],
                'sort_order' => $data['sort_order'] ?? 0
            ], 201);
            break;
            
        case 'PUT':
            // Обновить категорию
            if (!checkAdmin()) {
                sendError('Unauthorized', 401);
            }
            
            if (!$id) {
                sendError('Category ID is required');
            }
            
            $data = getJsonInput();
            
            $fields = [];
            $values = [];
            
            if (isset($data['name'])) {
                $fields[] = 'name = ?';
                $values[] = $data['name'];
            }
            
            if (isset($data['sort_order'])) {
                $fields[] = 'sort_order = ?';
                $values[] = $data['sort_order'];
            }
            
            if (empty($fields)) {
                sendError('No fields to update');
            }
            
            $values[] = $id;
            $sql = 'UPDATE categories SET ' . implode(', ', $fields) . ' WHERE id = ?';
            $stmt = $db->prepare($sql);
            $stmt->execute($values);
            
            if ($stmt->rowCount() === 0) {
                sendError('Category not found', 404);
            }
            
            sendJson(['success' => true]);
            break;
            
        case 'DELETE':
            // Удалить категорию
            if (!checkAdmin()) {
                sendError('Unauthorized', 401);
            }
            
            if (!$id) {
                sendError('Category ID is required');
            }
            
            // Сначала удаляем шаблоны этой категории
            $stmt = $db->prepare('DELETE FROM templates WHERE category_id = ?');
            $stmt->execute([$id]);
            
            // Затем удаляем категорию
            $stmt = $db->prepare('DELETE FROM categories WHERE id = ?');
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() === 0) {
                sendError('Category not found', 404);
            }
            
            sendJson(['success' => true]);
            break;
            
        default:
            sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}
