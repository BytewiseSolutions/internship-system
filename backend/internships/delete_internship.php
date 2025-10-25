<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!isset($_GET['id']) || empty($_GET['id'])) {
    send_json(['success' => false, 'message' => 'Internship ID is required'], 400);
}

$internship_id = $_GET['id'];

try {
    $stmt = $conn->prepare("DELETE FROM internships WHERE internship_id = ?");
    $stmt->bind_param('i', $internship_id);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        send_json(['success' => true, 'message' => 'Internship deleted successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Internship not found'], 404);
    }
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>