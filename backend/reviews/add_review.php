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

$input = json_decode(file_get_contents('php://input'), true);

$user_id = $input['user_id'] ?? null;
$internship_id = $input['internship_id'] ?? null;
$rating = $input['rating'] ?? null;
$review_text = $input['review_text'] ?? '';

if (!$user_id || !$internship_id || !$rating) {
    send_json(['success' => false, 'message' => 'Required fields missing'], 400);
}

if ($rating < 1 || $rating > 5) {
    send_json(['success' => false, 'message' => 'Rating must be between 1 and 5'], 400);
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
    
    // Check if review already exists
    $stmt = $conn->prepare("SELECT review_id FROM reviews WHERE student_id = ? AND internship_id = ?");
    $stmt->bind_param('ii', $student_id, $internship_id);
    $stmt->execute();
    $existing = $stmt->get_result();
    
    if ($existing->num_rows > 0) {
        send_json(['success' => false, 'message' => 'Review already exists for this internship'], 400);
    }
    
    // Insert review
    $stmt = $conn->prepare("
        INSERT INTO reviews (student_id, internship_id, rating, review_text) 
        VALUES (?, ?, ?, ?)
    ");
    
    $stmt->bind_param('iiis', $student_id, $internship_id, $rating, $review_text);
    
    if ($stmt->execute()) {
        send_json(['success' => true, 'message' => 'Review added successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Failed to add review'], 500);
    }
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>