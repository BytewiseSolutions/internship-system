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
    
    // Get applications with internship and company details
    $stmt = $conn->prepare("
        SELECT 
            a.application_id,
            a.status,
            a.applied_at,
            a.cv_path,
            a.transcript_path,
            a.application_letter_path,
            i.title as internship_title,
            i.description as internship_description,
            i.location,
            i.application_deadline as deadline,
            c.name as company_name,
            c.email as company_email,
            c.address as company_address
        FROM applications a
        JOIN internships i ON a.internship_id = i.internship_id
        JOIN companies c ON i.company_id = c.company_id
        WHERE a.student_id = ?
        ORDER BY a.applied_at DESC
    ");
    
    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $applications = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json(['success' => true, 'applications' => $applications]);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>