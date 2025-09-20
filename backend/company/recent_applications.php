<?php
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../cors.php";
require_once __DIR__ . "/../utils.php";

$company_id = isset($_GET['company_id']) ? intval($_GET['company_id']) : 0;
if ($company_id <= 0) {
    echo json_encode([]);
    exit;
}

$stmt = $conn->prepare("
    SELECT a.id, u.name AS student_name, i.title AS internship_title, a.status, a.created_at
    FROM applications a
    INNER JOIN users u ON a.student_id = u.id
    INNER JOIN internships i ON a.internship_id = i.id
    WHERE i.company_id = ?
    ORDER BY a.created_at DESC
    LIMIT 5
");

$stmt->bind_param("i", $company_id);
$stmt->execute();
$result = $stmt->get_result();

$applications = [];
while ($row = $result->fetch_assoc()) {
    $applications[] = $row;
}
echo json_encode($applications);
?>