<?php
require_once 'config.php';

// Update internships with past deadlines to INACTIVE status
$sql = "UPDATE internships SET status = 'INACTIVE' WHERE deadline < CURDATE() AND status = 'ACTIVE'";
$result = $conn->query($sql);

if ($result) {
    $affected = $conn->affected_rows;
    echo "Updated $affected expired internships to INACTIVE status.\n";
} else {
    echo "Error updating expired internships: " . $conn->error . "\n";
}

$conn->close();
?>