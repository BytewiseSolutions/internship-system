<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!isset($_GET['file']) || empty($_GET['file'])) {
    send_json(['success' => false, 'message' => 'File parameter is required'], 400);
}

$filename = $_GET['file'];
// Remove 'uploads/' prefix if it exists since we're already in the uploads directory context
$cleanFilename = str_replace('uploads/', '', $filename);
$filepath = '../uploads/' . $cleanFilename;

// Security check - ensure file exists and is within uploads directory
if (!file_exists($filepath)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'File not found']);
    exit;
}

// Additional security check to prevent directory traversal
$realFilePath = realpath($filepath);
$realUploadsPath = realpath('../uploads/');
if (!$realFilePath || !$realUploadsPath || strpos($realFilePath, $realUploadsPath) !== 0) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Access denied']);
    exit;
}

// Get file info
$fileinfo = pathinfo($filepath);
$extension = strtolower($fileinfo['extension']);

// Set appropriate content type
$contentTypes = [
    'pdf' => 'application/pdf',
    'doc' => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'txt' => 'text/plain'
];

$contentType = $contentTypes[$extension] ?? 'application/octet-stream';

// Set headers for file download
header('Content-Type: ' . $contentType);
header('Content-Disposition: inline; filename="' . basename($filepath) . '"');
header('Content-Length: ' . filesize($filepath));
header('Cache-Control: public, max-age=3600');

// Output file
readfile($filepath);
exit;
?>