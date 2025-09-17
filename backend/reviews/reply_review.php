<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$data = json_decode(file_get_contents('php://input'), true);
$review_id = $data['review_id'] ?? null;
$employer_reply = $data['employer_reply'] ?? null;

if (!$review_id || !$employer_reply) {
    send_json(['status' => 'error', 'message' => 'Review ID and reply required'], 400);
}

$sql = "UPDATE internshipdb.reviews SET employer_reply = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $employer_reply, $review_id);
if ($stmt->execute()) {
    send_json(['status' => 'success', 'message' => 'Reply saved']);
} else {
    send_json(['status' => 'error', 'message' => $conn->error], 500);
}

$stmt->close();
$conn->close();
?>