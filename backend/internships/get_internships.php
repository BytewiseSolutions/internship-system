<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

$sql = "
    SELECT 
        i.id, 
        i.title, 
        i.company_id, 
        c.name AS company_name, 
        i.location, 
        i.postedDate, 
        i.deadline, 
        i.description, 
        i.status 
    FROM internships i
    LEFT JOIN companies c ON i.company_id = c.id
    ORDER BY i.postedDate DESC
";

$result = $conn->query($sql);

if (!$result) {
    send_json(["error" => "SQL Error: " . $conn->error], 500);
}

$internships = [];
while ($row = $result->fetch_assoc()) {
    $internships[] = [
        "id" => isset($row['id']) ? (int) $row['id'] : null,
        "title" => $row['title'] ?? '',
        "company_id" => isset($row['company_id']) ? (int) $row['company_id'] : null,
        "company_name" => $row['company_name'] ?? null,
        "location" => $row['location'] ?? '',
        "postedDate" => $row['postedDate'] ?? null,
        "deadline" => $row['deadline'] ?? null,
        "description" => $row['description'] ?? '',
        "status" => $row['status'] ?? 'ACTIVE'
    ];
}

send_json($internships);
?>