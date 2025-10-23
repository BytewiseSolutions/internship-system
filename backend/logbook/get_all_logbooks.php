<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$query = "SELECT l.*, u.name as student_name, u.email as student_email 
          FROM logbook l 
          JOIN students s ON l.student_id = s.student_id
          JOIN users u ON s.user_id = u.user_id 
          ORDER BY l.created_at DESC";

$result = $conn->query($query);
$logbooks = $result->fetch_all(MYSQLI_ASSOC);

send_json($logbooks);
$conn->close();
?>