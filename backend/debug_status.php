<?php
require_once 'config.php';

// Check what status values exist in applications table
$result = $conn->query("SELECT DISTINCT status FROM applications");
echo "Status values in applications table:\n";
while ($row = $result->fetch_assoc()) {
    echo "'" . $row['status'] . "'\n";
}

// Check specific student's applications
$student_id = 8; // Replace with actual student ID
$stmt = $conn->prepare("SELECT id, status FROM applications WHERE student_id = ?");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

echo "\nApplications for student ID $student_id:\n";
while ($row = $result->fetch_assoc()) {
    echo "Application ID: " . $row['id'] . ", Status: '" . $row['status'] . "'\n";
}

$conn->close();
?>