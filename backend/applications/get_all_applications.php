<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$query = "
    SELECT 
        a.application_id,
        a.status,
        a.applied_at as created_at,
        st.student_id,
        u.name AS student_name,
        u.email AS student_email,
        i.internship_id,
        i.title AS internship_title,
        i.company_id
    FROM applications a
    JOIN students st ON a.student_id = st.student_id
    JOIN users u ON st.user_id = u.user_id
    JOIN internships i ON a.internship_id = i.internship_id
    ORDER BY a.applied_at DESC
";

$result = $conn->query($query);

$applications = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
    }
    send_json(['status' => 'success', 'applications' => $applications]);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}

$conn->close();
?>