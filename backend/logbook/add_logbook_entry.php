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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

$user_id = $input['user_id'] ?? null;
$week_number = $input['week_number'] ?? null;
$week_ending = $input['week_ending'] ?? null;
$activities_completed = $input['activities_completed'] ?? '';
$skills_learned = $input['skills_learned'] ?? '';
$challenges_faced = $input['challenges_faced'] ?? '';

if (!$user_id || !$week_number || !$week_ending) {
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
    
    // Optional: Check if student has accepted internship
    // Removed restriction - students can create logbook entries without accepted internships
    
    // Check if entry for this week already exists
    $stmt = $conn->prepare("SELECT logbook_id FROM logbook WHERE student_id = ? AND week_number = ?");
    $stmt->bind_param('ii', $student_id, $week_number);
    $stmt->execute();
    $existing = $stmt->get_result();
    
    if ($existing->num_rows > 0) {
        send_json(['success' => false, 'message' => 'Entry for this week already exists'], 400);
    }
    
    // Insert new logbook entry
    $stmt = $conn->prepare("
        INSERT INTO logbook (student_id, week_number, week_ending, activities_completed, skills_learned, challenges_faced) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->bind_param('iissss', $student_id, $week_number, $week_ending, $activities_completed, $skills_learned, $challenges_faced);
    
    if ($stmt->execute()) {
        send_json(['success' => true, 'message' => 'Logbook entry added successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Failed to add logbook entry'], 500);
    }
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>