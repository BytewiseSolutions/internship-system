<?php
require_once "config.php";

echo "=== LOGBOOK DEBUG ===\n\n";

// Check logbook table
echo "Logbook entries:\n";
$result = $conn->query("SELECT * FROM logbook");
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>