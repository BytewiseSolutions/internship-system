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

if (!isset($_GET['company_id']) || empty($_GET['company_id'])) {
    send_json(['success' => false, 'message' => 'Company ID is required'], 400);
}

$company_id = $_GET['company_id'];

try {
    $stmt = $conn->prepare("
        SELECT 
            r.review_id,
            r.rating,
            r.review_text,
            r.created_at,
            u.name as student_name,
            i.title as internship_title
        FROM reviews r
        JOIN internships i ON r.internship_id = i.internship_id
        JOIN students s ON r.student_id = s.student_id
        JOIN users u ON s.user_id = u.user_id
        WHERE i.company_id = ?
        ORDER BY r.created_at DESC
    ");
    
    $stmt->bind_param('i', $company_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $reviews = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json(['success' => true, 'reviews' => $reviews]);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>