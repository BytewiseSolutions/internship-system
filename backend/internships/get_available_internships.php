<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$sql = "SELECT i.internship_id as id, i.title, c.name, i.location, DATE(i.created_at) as postedDate, i.application_deadline as deadline, i.description, i.work_type, i.duration_months, i.salary_range, i.positions_available, i.required_skills, i.requirements, i.responsibilities, i.preferred_qualifications, i.contact_person, i.contact_email, i.contact_phone, 'General' as industry
        FROM internships i
        JOIN companies c ON i.company_id = c.company_id
        WHERE i.status = 'OPEN'
        ORDER BY i.created_at DESC";

// Debug: Log the query
error_log('Query: ' . $sql);
error_log('Current date: ' . date('Y-m-d'));

$result = $conn->query($sql);

$internships = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        error_log('Processing internship: ' . $row['title'] . ' - Deadline: ' . $row['deadline']);
        $internships[] = $row;
    }
} else {
    error_log('No results from query or query failed');
    if (!$result) {
        error_log('Query error: ' . $conn->error);
    }
}

// Debug: Log the results
error_log('Found internships: ' . count($internships));
error_log('Internships data: ' . json_encode($internships));

echo json_encode($internships);

$conn->close();
?>