<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$sql = "SELECT i.internship_id as id, i.title, c.name AS company_name, i.location, DATE(i.created_at) as postedDate, i.deadline, i.description, 'General' as industry
        FROM internships i
        JOIN companies c ON i.company_id = c.company_id
        WHERE i.status = 'OPEN' AND i.deadline >= CURDATE()
        ORDER BY i.created_at DESC";

$result = $conn->query($sql);

$internships = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $internships[] = $row;
    }
}

echo json_encode($internships);

$conn->close();
?>