<?php
require '../config.php';
require '../cors.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['review_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing review_id"]);
    exit();
}

$review_id = intval($data['review_id']);

$sql = "DELETE FROM reviews WHERE id = $review_id";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Review deleted"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete review"]);
}

$conn->close();
?>