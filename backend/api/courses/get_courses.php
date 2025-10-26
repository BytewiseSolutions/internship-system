<?php
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../utils.php';

$school_id = $_GET['school_id'] ?? null;

if (!$school_id) {
    send_json(['success' => false, 'message' => 'School ID required'], 400);
}

try {
    $stmt = $conn->prepare("SELECT course_id, course_name FROM courses WHERE school_id = ? ORDER BY course_name");
    $stmt->bind_param("i", $school_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $courses = [];
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }
    
    send_json([
        'success' => true,
        'courses' => $courses
    ]);
    
} catch (Exception $e) {
    send_json([
        'success' => false,
        'message' => 'Error fetching courses: ' . $e->getMessage()
    ], 500);
}

$conn->close();
?>