<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$userId = $_GET['id'] ?? null;

if (!$userId) {
    send_json(['success' => false, 'message' => 'User ID is required'], 400);
}

$stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
$stmt->bind_param("i", $userId);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'User deleted successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to delete user'], 500);
}
?>