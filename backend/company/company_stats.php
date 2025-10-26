<?php
require_once __DIR__ . "/../cors.php";
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../utils.php";

$company_id = isset($_GET['company_id']) ? intval($_GET['company_id']) : 0;

error_log("Company Stats Request - Company ID: " . $company_id);

if ($company_id <= 0) {
    echo json_encode(["error" => "Invalid company ID"]);
    exit;
}

try {
    // Count internship positions from internships table
    $stmt = $conn->prepare("SELECT COUNT(*) AS total FROM internships WHERE company_id = ?");
    $stmt->bind_param("i", $company_id);
    $stmt->execute();
    $totalInternships = $stmt->get_result()->fetch_assoc()['total'] ?? 0;

    // Count total applications for this company's internships
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS total 
        FROM applications a 
        JOIN internships i ON a.internship_id = i.internship_id 
        WHERE i.company_id = ?
    ");
    $stmt->bind_param("i", $company_id);
    $stmt->execute();
    $totalApplications = $stmt->get_result()->fetch_assoc()['total'] ?? 0;

    // Count reviews for this company's internships
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS total 
        FROM reviews r 
        JOIN internships i ON r.internship_id = i.internship_id 
        WHERE i.company_id = ?
    ");
    $stmt->bind_param("i", $company_id);
    $stmt->execute();
    $totalReviews = $stmt->get_result()->fetch_assoc()['total'] ?? 0;

    // Count accepted students for this company's internships
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS total 
        FROM applications a 
        JOIN internships i ON a.internship_id = i.internship_id 
        WHERE i.company_id = ? AND a.status = 'ACCEPTED'
    ");
    $stmt->bind_param("i", $company_id);
    $stmt->execute();
    $approvedStudents = $stmt->get_result()->fetch_assoc()['total'] ?? 0;

    $result = [
        "totalInternships" => intval($totalInternships),
        "totalApplications" => intval($totalApplications),
        "totalReviews" => intval($totalReviews),
        "approvedStudents" => intval($approvedStudents)
    ];
    
    error_log("Company Stats Result: " . json_encode($result));
    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}
