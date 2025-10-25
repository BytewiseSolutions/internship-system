<?php
require_once "config.php";

$company_id = $_GET['company_id'] ?? 1;

echo "Company ID: $company_id\n\n";

// Check internships table
$result = $conn->query("SELECT COUNT(*) as count FROM internships WHERE company_id = $company_id");
$internships = $result->fetch_assoc()['count'];
echo "Internships: $internships\n";

// Check applications table structure
echo "\nApplications table structure:\n";
$result = $conn->query("DESCRIBE applications");
while ($row = $result->fetch_assoc()) {
    echo $row['Field'] . " - " . $row['Type'] . "\n";
}

// Show actual applications data
echo "\nActual applications data:\n";
$result = $conn->query("SELECT * FROM applications LIMIT 5");
while ($row = $result->fetch_assoc()) {
    print_r($row);
}

// Show internships data
echo "\nActual internships data:\n";
$result = $conn->query("SELECT * FROM internships WHERE company_id = $company_id");
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>