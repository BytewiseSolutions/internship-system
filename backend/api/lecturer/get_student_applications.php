<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    send_json(['success' => false, 'message' => 'User ID is required'], 400);
}

// Get all accepted applications (simplified)
$stmt = $conn->prepare("
    SELECT 
        a.application_id,
        a.status,
        a.applied_at,
        a.student_id,
        'Internship' as internship_title,
        'Company' as company_name
    FROM applications a
    WHERE a.status = 'ACCEPTED'
    ORDER BY a.applied_at DESC
");

// No parameter needed for simplified query
$stmt->execute();
$result = $stmt->get_result();

$applications = [];
while ($row = $result->fetch_assoc()) {
    $applications[] = $row;
}

send_json($applications);
?>