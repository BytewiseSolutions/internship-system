<?php
require_once './config.php';

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    echo "Please provide user_id parameter\n";
    exit;
}

echo "Debugging lecturer data for user_id: $userId\n\n";

// Check if user exists
$stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if ($user) {
    echo "User found:\n";
    print_r($user);
} else {
    echo "User not found\n";
    exit;
}

// Check if lecturer record exists
$stmt = $conn->prepare("SELECT * FROM lecturers WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$lecturer = $stmt->get_result()->fetch_assoc();

if ($lecturer) {
    echo "\nLecturer record found:\n";
    print_r($lecturer);
    
    // Check course assignments
    $stmt = $conn->prepare("SELECT lc.*, c.course_name FROM lecturer_courses lc JOIN courses c ON lc.course_id = c.course_id WHERE lc.lecturer_id = ?");
    $stmt->bind_param("i", $lecturer['lecturer_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    echo "\nCourse assignments:\n";
    while ($row = $result->fetch_assoc()) {
        print_r($row);
    }
} else {
    echo "\nLecturer record not found\n";
}

$conn->close();
?>