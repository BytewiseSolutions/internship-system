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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Check if company_id is provided
if (!isset($_GET['company_id']) || empty($_GET['company_id'])) {
    send_json(['success' => false, 'message' => 'Company ID is required'], 400);
}

$company_id = $_GET['company_id'];

try {
    $stmt = $conn->prepare("
        SELECT 
            i.internship_id, 
            i.title, 
            i.description, 
            i.location, 
            i.deadline, 
            i.status,
            COUNT(a.application_id) as applications_count
        FROM internships i
        LEFT JOIN applications a ON i.internship_id = a.internship_id
        WHERE i.company_id = ?
        GROUP BY i.internship_id
        ORDER BY i.created_at DESC
    ");
    
    $stmt->bind_param('i', $company_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $internships = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json(['success' => true, 'internships' => $internships]);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}

?>