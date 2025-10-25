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

if (!$input) {
    send_json(['success' => false, 'message' => 'Invalid JSON input'], 400);
}

$required_fields = ['title', 'location', 'deadline', 'company_id'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        send_json(['success' => false, 'message' => "Field '$field' is required"], 400);
    }
}

try {
    $stmt = $conn->prepare("
        INSERT INTO internships (company_id, title, description, location, deadline, status) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $description = $input['description'] ?? '';
    $status = $input['status'] ?? 'OPEN';
    
    $stmt->bind_param('isssss', 
        $input['company_id'],
        $input['title'],
        $description,
        $input['location'],
        $input['deadline'],
        $status
    );
    
    $stmt->execute();
    
    send_json(['success' => true, 'message' => 'Internship created successfully']);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>