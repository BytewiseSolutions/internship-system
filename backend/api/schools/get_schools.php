<?php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../utils.php';

$result = $conn->query("SELECT school_id, name, address FROM schools ORDER BY name");
$schools = $result->fetch_all(MYSQLI_ASSOC);

send_json($schools);
$conn->close();
?>