<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$student_id = isset($_GET['student_id']) ? (int) $_GET['student_id'] : null;

if (!$student_id) {
    send_json(["error" => "Student ID missing"], 400);
}

$query = "
    SELECT 
        a.id,
        a.status,
        a.created_at AS submitted_at,
        i.title AS internship_title
    FROM applications a
    JOIN internships i ON a.internship_id = i.id
    WHERE a.student_id = $student_id
    ORDER BY a.created_at DESC
";

$result = $conn->query($query);

if (!$result) {
    send_json(["error" => $conn->error], 500);
}

$applications = [];
while ($row = $result->fetch_assoc()) {
    $applications[] = $row;
}

send_json($applications);
$conn->close();
?>