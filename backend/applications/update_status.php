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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['application_id']) || !isset($input['status'])) {
    send_json(['success' => false, 'message' => 'Application ID and status are required'], 400);
}

$allowed_statuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
if (!in_array($input['status'], $allowed_statuses)) {
    send_json(['success' => false, 'message' => 'Invalid status'], 400);
}

try {
    $stmt = $conn->prepare("UPDATE applications SET status = ? WHERE application_id = ?");
    $stmt->bind_param('si', $input['status'], $input['application_id']);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        send_json(['success' => true, 'message' => 'Application status updated successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Application not found'], 404);
    }
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>