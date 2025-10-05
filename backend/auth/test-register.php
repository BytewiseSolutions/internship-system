<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

send_json([
    'status' => 'success',
    'message' => 'Register endpoint is working',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>