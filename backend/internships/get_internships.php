<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

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

// Build SQL based on user role
if ($user['role'] === 'COMPANY') {
    // For company users, only show their internships
    $sql = "
        SELECT 
            i.internship_id as id, 
            i.title, 
            i.company_id, 
            c.name AS company_name, 
            i.location, 
            i.deadline as postedDate, 
            i.deadline, 
            i.description, 
            i.status 
        FROM internships i
        LEFT JOIN companies c ON i.company_id = c.company_id
        WHERE c.created_by = ?
        ORDER BY i.created_at DESC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    // For admin users, show all internships
    $sql = "
        SELECT 
            i.internship_id as id, 
            i.title, 
            i.company_id, 
            c.name AS company_name, 
            i.location, 
            i.deadline as postedDate, 
            i.deadline, 
            i.description, 
            i.status 
        FROM internships i
        LEFT JOIN companies c ON i.company_id = c.company_id
        ORDER BY i.created_at DESC
    ";
    $result = $conn->query($sql);
}

if (!$result) {
    send_json(["error" => "SQL Error: " . $conn->error], 500);
}

$internships = [];
while ($row = $result->fetch_assoc()) {
    $internships[] = [
        "id" => isset($row['id']) ? (int) $row['id'] : null,
        "title" => $row['title'] ?? '',
        "company_id" => isset($row['company_id']) ? (int) $row['company_id'] : null,
        "company_name" => $row['company_name'] ?? null,
        "location" => $row['location'] ?? '',
        "postedDate" => $row['postedDate'] ?? null,
        "deadline" => $row['deadline'] ?? null,
        "description" => $row['description'] ?? '',
        "status" => $row['status'] ?? 'ACTIVE'
    ];
}

send_json($internships);
?>