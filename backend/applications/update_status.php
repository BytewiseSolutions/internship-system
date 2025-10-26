<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../utils.php';
require_once '../utils/email_service.php';

$input = json_decode(file_get_contents('php://input'), true);

$application_id = $input['application_id'] ?? null;
$status = $input['status'] ?? null;

if (!$application_id || !$status) {
    send_json(['success' => false, 'message' => 'Application ID and status required'], 400);
}

try {
    // Get application details for notification
    $stmt = $conn->prepare("
        SELECT a.*, u.name as student_name, u.email as student_email, 
               i.title as internship_title
        FROM applications a
        JOIN students s ON a.student_id = s.student_id
        JOIN users u ON s.user_id = u.user_id
        JOIN internships i ON a.internship_id = i.internship_id
        WHERE a.application_id = ?
    ");
    $stmt->bind_param('i', $application_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $application = $result->fetch_assoc();
    
    if (!$application) {
        send_json(['success' => false, 'message' => 'Application not found'], 404);
    }
    
    // Update status
    $stmt = $conn->prepare("UPDATE applications SET status = ? WHERE application_id = ?");
    $stmt->bind_param('si', $status, $application_id);
    $stmt->execute();
    
    // Get user_id from student_id
    $userStmt = $conn->prepare("SELECT user_id FROM students WHERE student_id = ?");
    $userStmt->bind_param('i', $application['student_id']);
    $userStmt->execute();
    $userResult = $userStmt->get_result();
    $userData = $userResult->fetch_assoc();
    $user_id = $userData['user_id'];
    
    // Add notification
    $message = "Your application for {$application['internship_title']} has been {$status}";
    $stmt = $conn->prepare("INSERT INTO notifications (user_id, message) VALUES (?, ?)");
    $stmt->bind_param('is', $user_id, $message);
    $stmt->execute();
    
    // Send email notification
    $emailService = new EmailService();
    $emailService->sendStatusUpdate(
        $application['student_email'],
        $application['student_name'],
        $application['internship_title'],
        $status
    );
    
    send_json(['success' => true, 'message' => 'Status updated successfully']);
} catch (Exception $e) {
    send_json(['success' => false, 'message' => $e->getMessage()], 500);
}
?>