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

$input = json_decode(file_get_contents('php://input'), true);

$review_id = $input['review_id'] ?? null;
$rating = $input['rating'] ?? null;
$review_text = $input['review_text'] ?? '';

if (!$review_id || !$rating) {
    send_json(['success' => false, 'message' => 'Required fields missing'], 400);
}

if ($rating < 1 || $rating > 5) {
    send_json(['success' => false, 'message' => 'Rating must be between 1 and 5'], 400);
}

try {
    $stmt = $conn->prepare("UPDATE reviews SET rating = ?, review_text = ? WHERE review_id = ?");
    $stmt->bind_param('isi', $rating, $review_text, $review_id);
    
    if ($stmt->execute()) {
        send_json(['success' => true, 'message' => 'Review updated successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Failed to update review'], 500);
    }
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>