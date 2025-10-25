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
    // Get student_id from user_id
    $stmt = $conn->prepare("SELECT student_id FROM students WHERE user_id = ?");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        send_json(['success' => false, 'message' => 'Student not found'], 404);
    }
    
    $student = $result->fetch_assoc();
    $student_id = $student['student_id'];
    
    // Get reviews with company details
    $stmt = $conn->prepare("
        SELECT 
            r.review_id,
            r.rating,
            r.review_text,
            r.created_at,
            c.name as company_name,
            i.title as internship_title
        FROM reviews r
        JOIN internships i ON r.internship_id = i.internship_id
        JOIN companies c ON i.company_id = c.company_id
        WHERE r.student_id = ?
        ORDER BY r.created_at DESC
    ");
    
    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $reviews = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json(['success' => true, 'reviews' => $reviews]);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>