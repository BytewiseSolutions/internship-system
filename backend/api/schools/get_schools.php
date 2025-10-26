<?php
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../utils.php';

try {
    $stmt = $conn->prepare("SELECT school_id, name FROM schools ORDER BY name");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $schools = [];
    while ($row = $result->fetch_assoc()) {
        $schools[] = $row;
    }
    
    send_json([
        'success' => true,
        'schools' => $schools
    ]);
    
} catch (Exception $e) {
    send_json([
        'success' => false,
        'message' => 'Error fetching schools: ' . $e->getMessage()
    ], 500);
}

$conn->close();
?>