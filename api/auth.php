<?php
/**
 * API для авторизации и управления паролем
 * 
 * POST /api/auth.php { action: 'check' }     - проверить пароль
 * POST /api/auth.php { action: 'change', newPassword: '...' } - сменить пароль
 */

require_once __DIR__ . '/db.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();
$action = $data['action'] ?? '';

switch ($action) {
    case 'check':
        // Проверка пароля
        if (checkAdmin()) {
            sendJson(['success' => true, 'message' => 'Authorized']);
        } else {
            sendError('Invalid password', 401);
        }
        break;
        
    case 'change':
        // Смена пароля - требует текущей авторизации
        if (!checkAdmin()) {
            sendError('Unauthorized', 401);
        }
        
        $newPassword = $data['newPassword'] ?? '';
        
        if (strlen($newPassword) < 6) {
            sendError('Password must be at least 6 characters');
        }
        
        // Читаем config.php
        $configPath = __DIR__ . '/config.php';
        $configContent = file_get_contents($configPath);
        
        if ($configContent === false) {
            sendError('Cannot read config file', 500);
        }
        
        // Заменяем пароль
        $newContent = preg_replace(
            "/define\s*\(\s*'ADMIN_PASSWORD'\s*,\s*'[^']*'\s*\)/",
            "define('ADMIN_PASSWORD', '" . addslashes($newPassword) . "')",
            $configContent
        );
        
        if ($newContent === $configContent) {
            sendError('Password pattern not found in config', 500);
        }
        
        // Записываем обратно
        if (file_put_contents($configPath, $newContent) === false) {
            sendError('Cannot write config file', 500);
        }
        
        sendJson(['success' => true, 'message' => 'Password changed']);
        break;
        
    default:
        sendError('Unknown action');
}
