<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../utils.php';

$search = $_GET['search'] ?? '';
$location = $_GET['location'] ?? '';
$work_type = $_GET['work_type'] ?? '';
$salary_min = $_GET['salary_min'] ?? '';
$company = $_GET['company'] ?? '';

try {
    $sql = "SELECT i.internship_id as id, i.title, c.name, i.location, 
                   DATE(i.created_at) as postedDate, i.application_deadline as deadline, 
                   i.description, i.work_type, i.salary_range
            FROM internships i
            JOIN companies c ON i.company_id = c.company_id
            WHERE i.status = 'OPEN' AND i.application_deadline >= CURDATE()";
    
    $params = [];
    $types = '';
    
    if (!empty($search)) {
        $sql .= " AND (i.title LIKE ? OR i.description LIKE ? OR i.required_skills LIKE ?)";
        $search_param = "%$search%";
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
        $types .= 'sss';
    }
    
    if (!empty($location)) {
        $sql .= " AND i.location LIKE ?";
        $params[] = "%$location%";
        $types .= 's';
    }
    
    if (!empty($work_type)) {
        $sql .= " AND i.work_type = ?";
        $params[] = $work_type;
        $types .= 's';
    }
    
    if (!empty($company)) {
        $sql .= " AND c.name LIKE ?";
        $params[] = "%$company%";
        $types .= 's';
    }
    
    $sql .= " ORDER BY i.created_at DESC";
    
    $stmt = $conn->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $internships = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode($internships);
} catch (Exception $e) {
    send_json(['error' => $e->getMessage()], 500);
}
?>