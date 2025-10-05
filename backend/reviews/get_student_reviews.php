<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$student_id = isset($_GET['student_id']) ? (int) $_GET['student_id'] : null;

if (!$student_id) {
    send_json(['status' => 'error', 'message' => 'Student ID required'], 400);
}

$sql = "
    SELECT 
        r.id,
        r.student_id,
        u.name AS student_name,
        r.internship_id,
        i.title AS internship_title,
        r.rating,
        r.comment,
        r.employer_reply,
        r.status,
        r.created_at
    FROM internshipdb.reviews r
    JOIN internshipdb.users u ON r.student_id = u.id
    JOIN internshipdb.internships i ON r.internship_id = i.id
    WHERE r.student_id = ?
    ORDER BY r.created_at DESC
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    send_json(['status' => 'error', 'message' => $conn->error], 500);
}

$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = [
        'id' => (int) $row['id'],
        'student_id' => (int) $row['student_id'],
        'student_name' => $row['student_name'],
        'internship_id' => (int) $row['internship_id'],
        'internship_title' => $row['internship_title'],
        'rating' => (int) $row['rating'],
        'comment' => $row['comment'],
        'employer_reply' => $row['employer_reply'] ?? null,
        'status' => $row['status'],
        'created_at' => $row['created_at']
    ];
}

send_json(['reviews' => $reviews]);

$stmt->close();
$conn->close();
?>