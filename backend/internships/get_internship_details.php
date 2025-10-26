<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    send_json(['error' => 'Internship ID is required'], 400);
}

$internship_id = $_GET['id'];

$sql = "SELECT i.internship_id as id, i.title, c.name, i.location, i.description, 
               i.requirements, i.responsibilities, i.work_type, i.duration_months,
               i.start_date, i.end_date, i.application_deadline as deadline, 
               i.salary_range, i.positions_available, i.required_skills, 
               i.preferred_qualifications, i.contact_person, i.contact_email, 
               i.contact_phone, i.status, DATE(i.created_at) as postedDate
        FROM internships i
        JOIN companies c ON i.company_id = c.company_id
        WHERE i.internship_id = ? AND i.status = 'OPEN'";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $internship_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $internship = $result->fetch_assoc();
    echo json_encode($internship);
} else {
    send_json(['error' => 'Internship not found'], 404);
}

$conn->close();
?>