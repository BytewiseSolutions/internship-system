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
    
    // Check if student has accepted internship (optional)
    $stmt = $conn->prepare("
        SELECT a.application_id, i.title as internship_title, c.name as company_name
        FROM applications a
        JOIN internships i ON a.internship_id = i.internship_id
        JOIN companies c ON i.company_id = c.company_id
        WHERE a.student_id = ? AND (a.status = 'accepted' OR a.status = 'approved')
        LIMIT 1
    ");
    
    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $internship_result = $stmt->get_result();
    
    $internship = null;
    if ($internship_result->num_rows > 0) {
        $internship = $internship_result->fetch_assoc();
    } else {
        // No accepted internship - return friendly message
        send_json([
            'success' => true, 
            'entries' => [],
            'internship' => null,
            'message' => 'No active internship found. Logbook will be available once you have an accepted internship.'
        ]);
        return;
    }
    
    // Get logbook entries
    $stmt = $conn->prepare("
        SELECT 
            logbook_id,
            week_number,
            week_ending,
            activities_completed,
            skills_learned,
            challenges_faced,
            supervisor_feedback,
            created_at
        FROM logbook 
        WHERE student_id = ?
        ORDER BY week_number DESC
    ");
    
    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $entries = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json([
        'success' => true, 
        'entries' => $entries,
        'internship' => $internship
    ]);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>