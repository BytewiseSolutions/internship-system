<?php
require_once __DIR__ . "/../cors.php";
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../utils.php";

$company_id = isset($_GET['company_id']) ? intval($_GET['company_id']) : 0;

if ($company_id <= 0) {
    echo json_encode(["error" => "Invalid company ID"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT COUNT(*) AS total FROM internships WHERE company_id = ?");
    $stmt->bind_param("i", $company_id);
    $stmt->execute();
    $totalInternships = $stmt->get_result()->fetch_assoc()['total'] ?? 0;

    $stmt = $conn->prepare("
        SELECT COUNT(*) AS total 
        FROM applications a
        INNER JOIN internships i ON a.internship_id = i.id
    ");
    // $stmt->bind_param("i", $company_id);
    $stmt->execute();
    $totalApplications = $stmt->get_result()->fetch_assoc()['total'] ?? 0;

    $stmt = $conn->prepare("SELECT COUNT(*) AS total FROM reviews WHERE company_id = ?");
    $stmt->bind_param("i", $company_id);
    $stmt->execute();
    $totalReviews = $stmt->get_result()->fetch_assoc()['total'] ?? 0;

    $stmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM applications a
    INNER JOIN internships i ON a.internship_id = i.id
    WHERE i.company_id = ? AND a.status = 'ACCEPTED'
");
    $stmt->bind_param("i", $company_id);
    $stmt->execute();
    $approvedStudents = $stmt->get_result()->fetch_assoc()['total'] ?? 0;

    echo json_encode([
        "totalInternships" => intval($totalInternships),
        "totalApplications" => intval($totalApplications),
        "totalReviews" => intval($totalReviews),
        "approvedStudents" => intval($approvedStudents)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}
