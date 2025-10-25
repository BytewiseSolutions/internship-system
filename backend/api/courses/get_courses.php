<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

if (!isset($_GET['school_id']) || empty($_GET['school_id'])) {
    send_json(['success' => false, 'message' => 'School ID is required'], 400);
}

$school_id = $_GET['school_id'];

try {
    $stmt = $conn->prepare("SELECT course_id, course_name FROM courses WHERE school_id = ? ORDER BY course_name");
    $stmt->bind_param('i', $school_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $courses = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json(['success' => true, 'courses' => $courses]);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>