<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

$company_id = $_GET['company_id'] ?? null;

try {
    if ($company_id) {
        // Company-specific analytics
        $stats = [];
        
        // Total internships
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM internships WHERE company_id = ?");
        $stmt->bind_param('i', $company_id);
        $stmt->execute();
        $stats['total_internships'] = $stmt->get_result()->fetch_assoc()['total'];
        
        // Total applications
        $stmt = $conn->prepare("
            SELECT COUNT(*) as total 
            FROM applications a 
            JOIN internships i ON a.internship_id = i.internship_id 
            WHERE i.company_id = ?
        ");
        $stmt->bind_param('i', $company_id);
        $stmt->execute();
        $stats['total_applications'] = $stmt->get_result()->fetch_assoc()['total'];
        
        // Applications by status
        $stmt = $conn->prepare("
            SELECT a.status, COUNT(*) as count
            FROM applications a 
            JOIN internships i ON a.internship_id = i.internship_id 
            WHERE i.company_id = ?
            GROUP BY a.status
        ");
        $stmt->bind_param('i', $company_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats['applications_by_status'] = $result->fetch_all(MYSQLI_ASSOC);
        
    } else {
        // System-wide analytics
        $stats = [];
        $stats['total_users'] = $conn->query("SELECT COUNT(*) as total FROM users")->fetch_assoc()['total'];
        $stats['total_companies'] = $conn->query("SELECT COUNT(*) as total FROM companies")->fetch_assoc()['total'];
        $stats['total_students'] = $conn->query("SELECT COUNT(*) as total FROM students")->fetch_assoc()['total'];
        $stats['total_internships'] = $conn->query("SELECT COUNT(*) as total FROM internships")->fetch_assoc()['total'];
        $stats['total_applications'] = $conn->query("SELECT COUNT(*) as total FROM applications")->fetch_assoc()['total'];
    }
    
    send_json(['success' => true, 'stats' => $stats]);
} catch (Exception $e) {
    send_json(['success' => false, 'message' => $e->getMessage()], 500);
}
?>