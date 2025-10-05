<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['review_id']) || !isset($input['status'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit();
}

$review_id = intval($input['review_id']);
$status = $conn->real_escape_string($input['status']);

$sql = "UPDATE reviews SET status='$status' WHERE id=$review_id";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Review updated"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update review"]);
}

$conn->close();
?>