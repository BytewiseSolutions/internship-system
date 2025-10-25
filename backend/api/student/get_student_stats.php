<?php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../utils.php';

$user_id = $_GET['student_id'] ?? null;

if (!$user_id) {
    send_json(['error' => 'User ID is required'], 400);
}

try {
    // Get student_id from user_id
    $stmt = $conn->prepare("SELECT student_id FROM students WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        send_json(['error' => 'Student not found'], 404);
    }
    
    $student = $result->fetch_assoc();
    $student_id = $student['student_id'];

    // Get total applications count
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM applications WHERE student_id = ?");
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $applications = $stmt->get_result()->fetch_assoc()['count'];

    // Get interviews count (applications with status 'INTERVIEW' or 'ACCEPTED')
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM applications WHERE student_id = ? AND (UPPER(status) = 'INTERVIEW' OR UPPER(status) = 'ACCEPTED')");
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $interviews = $stmt->get_result()->fetch_assoc()['count'];

    // Get active internships count
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM applications WHERE student_id = ? AND UPPER(status) = 'ACCEPTED'");
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $internships = $stmt->get_result()->fetch_assoc()['count'];

    // Get logbook entries count (check if table exists first)
    $logbookEntries = 0;
    $table_check = $conn->query("SHOW TABLES LIKE 'logbook_entries'");
    if ($table_check->num_rows > 0) {
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM logbook_entries WHERE student_id = ?");
        $stmt->bind_param("i", $student_id);
        $stmt->execute();
        $logbook_result = $stmt->get_result();
        $logbookEntries = $logbook_result->num_rows > 0 ? $logbook_result->fetch_assoc()['count'] : 0;
    }

    send_json([
        'applications' => (int)$applications,
        'interviews' => (int)$interviews,
        'internships' => (int)$internships,
        'logbookEntries' => (int)$logbookEntries
    ]);

} catch (Exception $e) {
    error_log("Error in get_student_stats.php: " . $e->getMessage());
    send_json(['error' => 'Database error occurred'], 500);
}
?>