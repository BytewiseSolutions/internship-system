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
    
    // Get completed internships that don't have reviews yet
    $stmt = $conn->prepare("
        SELECT 
            a.application_id,
            i.internship_id,
            i.title as internship_title,
            c.company_id,
            c.name as company_name,
            i.deadline
        FROM applications a
        JOIN internships i ON a.internship_id = i.internship_id
        JOIN companies c ON i.company_id = c.company_id
        LEFT JOIN reviews r ON r.student_id = ? AND r.internship_id = i.internship_id
        WHERE a.student_id = ? 
        AND (a.status = 'accepted' OR a.status = 'approved')
        AND r.review_id IS NULL
        ORDER BY i.deadline DESC
    ");
    
    $stmt->bind_param('ii', $student_id, $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $internships = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json(['success' => true, 'internships' => $internships]);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>