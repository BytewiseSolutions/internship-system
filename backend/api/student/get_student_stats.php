<?php
// Enhanced Student Statistics API
// Step 3: Modern Dashboard Backend Support

require_once '../../config.php';
require_once '../../cors.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Only GET method allowed');
    }

    $student_id = $_GET['student_id'] ?? null;
    
    if (!$student_id) {
        throw new Exception('Student ID is required');
    }

    // Validate student exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ? AND user_type = 'student'");
    $stmt->execute([$student_id]);
    
    if (!$stmt->fetch()) {
        throw new Exception('Student not found');
    }

    // Get application statistics
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(*) as total_applications,
            SUM(CASE WHEN status = 'ACCEPTED' THEN 1 ELSE 0 END) as accepted,
            SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) as rejected,
            SUM(CASE WHEN interview_scheduled = 1 THEN 1 ELSE 0 END) as interviews
        FROM applications 
        WHERE student_id = ?
    ");
    $stmt->execute([$student_id]);
    $app_stats = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get logbook entries count
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as logbook_entries
        FROM logbook_entries 
        WHERE student_id = ?
    ");
    $stmt->execute([$student_id]);
    $logbook_stats = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get active internships count
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as active_internships
        FROM applications a
        JOIN internships i ON a.internship_id = i.id
        WHERE a.student_id = ? 
        AND a.status = 'ACCEPTED'
        AND i.status = 'active'
    ");
    $stmt->execute([$student_id]);
    $internship_stats = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get recent activity
    $stmt = $pdo->prepare("
        (SELECT 
            'application' as type,
            CONCAT('Applied to ', i.title, ' at ', c.name) as text,
            a.created_at as timestamp,
            'paper-plane' as icon
        FROM applications a
        JOIN internships i ON a.internship_id = i.id
        JOIN companies c ON i.company_id = c.id
        WHERE a.student_id = ?
        ORDER BY a.created_at DESC
        LIMIT 3)
        
        UNION ALL
        
        (SELECT 
            'logbook' as type,
            CONCAT('Added logbook entry: ', LEFT(l.entry_text, 50), '...') as text,
            l.created_at as timestamp,
            'create' as icon
        FROM logbook_entries l
        WHERE l.student_id = ?
        ORDER BY l.created_at DESC
        LIMIT 2)
        
        ORDER BY timestamp DESC
        LIMIT 5
    ");
    $stmt->execute([$student_id, $student_id]);
    $recent_activity = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Compile response
    $response = [
        'success' => true,
        'applications' => (int)$app_stats['total_applications'],
        'accepted' => (int)$app_stats['accepted'],
        'pending' => (int)$app_stats['pending'],
        'rejected' => (int)$app_stats['rejected'],
        'interviews' => (int)$app_stats['interviews'],
        'internships' => (int)$internship_stats['active_internships'],
        'logbookEntries' => (int)$logbook_stats['logbook_entries'],
        'recentActivity' => $recent_activity
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>