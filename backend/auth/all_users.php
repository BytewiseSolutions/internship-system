<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/../config.php';

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

$loggedInEmail = '';
if ($token) {
    $payload = decodeToken($token);
    $loggedInEmail = $payload['email'] ?? '';
}

if ($loggedInEmail) {
    $stmt = $conn->prepare("SELECT id, name, email, contact, role, status FROM users WHERE email != ?");
    $stmt->bind_param("s", $loggedInEmail);
    $stmt->execute();
    $result = $stmt->get_result();
    $users = $result->fetch_all(MYSQLI_ASSOC);
} else {
    $result = $conn->query("SELECT id, name, email, contact, role, status FROM users");
    $users = $result->fetch_all(MYSQLI_ASSOC);
}

echo json_encode($users);
$stmt->close();
$conn->close();

