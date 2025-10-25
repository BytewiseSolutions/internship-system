<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../utils.php';

if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
    send_json(['success' => false, 'message' => 'User ID is required'], 400);
}

$user_id = $_GET['user_id'];

try {
    $stmt = $conn->prepare("
        SELECT 
            u.user_id,
            u.name,
            u.email,
            s.student_id,
            s.course_id,
            c.course_name
        FROM users u
        JOIN students s ON u.user_id = s.user_id
        LEFT JOIN courses c ON s.course_id = c.course_id
        WHERE u.user_id = ?
    ");
    
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        send_json(['success' => false, 'message' => 'Student not found'], 404);
    }
    
    $profile = $result->fetch_assoc();
    send_json(['success' => true, 'profile' => $profile]);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>