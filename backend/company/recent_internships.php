<?php
require_once __DIR__ . "/../cors.php";
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../utils.php";

$company_id = isset($_GET['company_id']) ? intval($_GET['company_id']) : 0;

if ($company_id <= 0) {
    echo json_encode([]);
    exit;
}

$stmt = $conn->prepare("SELECT id, title, location, deadline, status FROM internships WHERE company_id = ? ORDER BY postedDate DESC LIMIT 5");
$stmt->bind_param("i", $company_id);
$stmt->execute();
$result = $stmt->get_result();

$internships = [];
while ($row = $result->fetch_assoc()) {
    $internships[] = $row;
}

echo json_encode($internships);
?>