<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$company_id = isset($_GET['company_id']) ? (int) $_GET['company_id'] : null;

if (!$company_id) {
    send_json(['status' => 'error', 'message' => 'Company ID required'], 400);
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
FROM reviews r
JOIN internships i ON r.internship_id = i.id
JOIN users u ON r.student_id = u.id
WHERE r.company_id = ?
ORDER BY r.created_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $company_id);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

send_json($reviews);

$stmt->close();
$conn->close();

?>