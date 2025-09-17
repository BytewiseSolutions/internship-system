<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$query = "
    SELECT 
        a.id AS application_id,
        a.status,
        a.cvPath,
        a.transcriptPath,
        a.applicationLetterPath,
        a.created_at,
        s.id AS student_id,
        s.name AS student_name,
        s.email AS student_email,
        i.id AS internship_id,
        i.title AS internship_title,
        i.company_id
    FROM applications a
    JOIN users s ON a.student_id = s.id
    JOIN internships i ON a.internship_id = i.id
    ORDER BY a.created_at DESC
";

$result = $conn->query($query);

$applications = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
    }
    echo json_encode(['status' => 'success', 'applications' => $applications]);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}

$conn->close();
?>