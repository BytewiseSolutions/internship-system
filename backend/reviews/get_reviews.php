<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$user_id = isset($_GET['user_id']) ? (int) $_GET['user_id'] : null;
$role = isset($_GET['role']) ? $_GET['role'] : null;

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
    JOIN users u ON r.student_id = u.id
    JOIN internships i ON r.internship_id = i.id
";

$params = [];
$types = "";
$where = [];

if ($role === 'STUDENT' && $user_id) {
    $where[] = "r.student_id = ?";
    $types .= "i";
    $params[] = $user_id;
} elseif ($role === 'COMPANY' && $user_id) {
    $company_sql = "SELECT id FROM internshipdb.companies WHERE id = ?";
    $stmtCompany = $conn->prepare($company_sql);
    $stmtCompany->bind_param("i", $user_id);
    $stmtCompany->execute();
    $resultCompany = $stmtCompany->get_result();
    $company = $resultCompany->fetch_assoc();
    $stmtCompany->close();

    if ($company) {
        $where[] = "i.company_id = ?";
        $types .= "i";
        $params[] = $company['id'];
    }
}

if ($role !== 'ADMIN') {
    $where[] = "r.status = 'ACCEPTED'";
}

if (!empty($where)) {
    $sql .= " WHERE " . implode(" AND ", $where);
}

$sql .= " ORDER BY r.created_at DESC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    send_json(['status' => 'error', 'message' => $conn->error], 500);
}

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

send_json(['reviews' => $reviews]);

$stmt->close();
$conn->close();
?>