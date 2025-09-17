<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$sql = "SELECT i.id, i.title, c.name AS company_name, i.location, i.postedDate, i.description 
        FROM internships i
        JOIN companies c ON i.company_id = c.id
        WHERE i.status = 'Active'
        ORDER BY i.postedDate DESC";

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