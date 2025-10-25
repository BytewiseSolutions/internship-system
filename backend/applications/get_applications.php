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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!isset($_GET['company_id']) || empty($_GET['company_id'])) {
    send_json(['success' => false, 'message' => 'Company ID is required'], 400);
}

$company_id = $_GET['company_id'];

try {
    $stmt = $conn->prepare("
        SELECT 
            a.application_id,
            a.status,
            a.applied_at,
            u.name as student_name,
            i.title as internship_title
        FROM applications a
        JOIN internships i ON a.internship_id = i.internship_id
        JOIN students s ON a.student_id = s.student_id
        JOIN users u ON s.user_id = u.user_id
        WHERE i.company_id = ?
        ORDER BY a.applied_at DESC
    ");
    
    $stmt->bind_param('i', $company_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $applications = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json(['success' => true, 'applications' => $applications]);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>