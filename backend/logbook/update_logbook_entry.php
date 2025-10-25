<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

$logbook_id = $input['logbook_id'] ?? null;
$user_id = $input['user_id'] ?? null;
$week_ending = $input['week_ending'] ?? null;
$activities_completed = $input['activities_completed'] ?? '';
$skills_learned = $input['skills_learned'] ?? '';
$challenges_faced = $input['challenges_faced'] ?? '';

if (!$logbook_id || !$user_id || !$week_ending) {
    send_json(['success' => false, 'message' => 'Required fields missing'], 400);
}

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
    
    // Verify the logbook entry belongs to this student
    $stmt = $conn->prepare("SELECT logbook_id FROM logbook WHERE logbook_id = ? AND student_id = ?");
    $stmt->bind_param('ii', $logbook_id, $student_id);
    $stmt->execute();
    $verify = $stmt->get_result();
    
    if ($verify->num_rows === 0) {
        send_json(['success' => false, 'message' => 'Logbook entry not found or access denied'], 403);
    }
    
    // Update logbook entry
    $stmt = $conn->prepare("
        UPDATE logbook 
        SET week_ending = ?, activities_completed = ?, skills_learned = ?, challenges_faced = ?
        WHERE logbook_id = ? AND student_id = ?
    ");
    
    $stmt->bind_param('ssssii', $week_ending, $activities_completed, $skills_learned, $challenges_faced, $logbook_id, $student_id);
    
    if ($stmt->execute()) {
        send_json(['success' => true, 'message' => 'Logbook entry updated successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Failed to update logbook entry'], 500);
    }
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>