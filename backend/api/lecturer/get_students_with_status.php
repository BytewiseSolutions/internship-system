<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

try {
    $stmt = $conn->prepare("
        SELECT 
            u.user_id,
            u.name,
            u.email,
            s.student_id,
            c.course_name,
            COALESCE(comp.name, 'Not assigned') as company_name,
            CASE 
                WHEN a.status = 'ACCEPTED' THEN 'Active Internship'
                WHEN a.status = 'PENDING' THEN 'Application Pending'
                WHEN a.status = 'REJECTED' THEN 'Application Rejected'
                ELSE 'No Application'
            END as internship_status
        FROM users u
        JOIN students s ON u.user_id = s.user_id
        JOIN courses c ON s.course_id = c.course_id
        LEFT JOIN applications a ON s.student_id = a.student_id
        LEFT JOIN internships i ON a.internship_id = i.internship_id
        LEFT JOIN companies comp ON i.company_id = comp.company_id
        WHERE u.role = 'STUDENT'
        ORDER BY u.name
    ");
    
    $stmt->execute();
    $result = $stmt->get_result();
    $students = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json($students);
    
} catch (Exception $e) {
    send_json(['error' => 'Database error: ' . $e->getMessage()], 500);
}
?>