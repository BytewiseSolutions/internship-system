<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once './config.php';
require_once './utils.php';

try {
    $stmt = $conn->prepare("
        SELECT 
            u.user_id,
            u.name,
            u.email,
            u.role,
            u.status,
            u.created_at,
            s.name as school_name,
            c.name as company_name
        FROM users u
        LEFT JOIN schools s ON u.school_id = s.school_id
        LEFT JOIN companies c ON u.company_id = c.company_id
        ORDER BY u.created_at DESC
    ");
    
    $stmt->execute();
    $result = $stmt->get_result();
    $users = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json(['success' => true, 'users' => $users]);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>