<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

// Get token from Authorization header
$headers = getallheaders();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

if (!$token) {
    send_json(['error' => 'No token provided'], 401);
}

$payload = decodeToken($token);
if (empty($payload) || !isset($payload['email'])) {
    send_json(['error' => 'Invalid token'], 401);
}

// Get user info
$stmt = $conn->prepare("SELECT user_id, role FROM users WHERE email = ?");
$stmt->bind_param("s", $payload['email']);
$stmt->execute();
$userResult = $stmt->get_result();
$user = $userResult->fetch_assoc();

if (!$user) {
    send_json(['error' => 'User not found'], 404);
}

// If user is COMPANY role, only return their company
if ($user['role'] === 'COMPANY') {
    $stmt = $conn->prepare("SELECT * FROM companies WHERE created_by = ?");
    $stmt->bind_param("i", $user['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    // For ADMIN users, return all companies
    $result = $conn->query("SELECT * FROM companies ORDER BY created_at DESC");
}

$companies = [];
while ($row = $result->fetch_assoc()) {
    $companies[] = [
        "id" => (int) $row['company_id'],
        "name" => $row['name'],
        "email" => $row['email'],
        "industry" => $row['industry'],
        "createdAt" => $row['created_at'],
        "status" => $row['status']
    ];
}

send_json($companies);
