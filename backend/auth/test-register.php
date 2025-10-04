<?php
require '../cors.php';
require '../config.php';
require '../utils.php';

send_json([
    'status' => 'success',
    'message' => 'Register endpoint is working',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>