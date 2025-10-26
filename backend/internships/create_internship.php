<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    send_json(['success' => false, 'message' => 'Invalid JSON input'], 400);
}

$required_fields = ['title', 'location', 'application_deadline', 'company_id'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        send_json(['success' => false, 'message' => "Field '$field' is required"], 400);
    }
}

try {
    error_log('Received data: ' . json_encode($input));
    
    $stmt = $conn->prepare("
        INSERT INTO internships (
            company_id, title, description, requirements, responsibilities, location, 
            work_type, duration_months, start_date, end_date, application_deadline, salary_range, 
            positions_available, required_skills, preferred_qualifications, 
            contact_person, contact_email, contact_phone, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $company_id = $input['company_id'];
    $title = $input['title'];
    $description = $input['description'] ?? '';
    $requirements = $input['requirements'] ?? '';
    $responsibilities = $input['responsibilities'] ?? '';
    $location = $input['location'];
    $work_type_input = $input['work_type'] ?? 'ON_SITE';
    $valid_work_types = ['REMOTE', 'ON_SITE', 'HYBRID'];
    $work_type = in_array($work_type_input, $valid_work_types) ? $work_type_input : 'ON_SITE';
    $duration_months = (int)($input['duration_months'] ?? 3);
    $start_date = !empty($input['start_date']) ? $input['start_date'] : null;
    $end_date = !empty($input['end_date']) ? $input['end_date'] : null;
    $application_deadline = $input['application_deadline'];
    $salary_range = $input['salary_range'] ?? '';
    $positions_available = (int)($input['positions_available'] ?? 1);
    $required_skills = $input['required_skills'] ?? '';
    $preferred_qualifications = $input['preferred_qualifications'] ?? '';
    $contact_person = $input['contact_person'] ?? '';
    $contact_email = $input['contact_email'] ?? '';
    $contact_phone = $input['contact_phone'] ?? '';
    $status_input = $input['status'] ?? 'OPEN';
    $valid_statuses = ['OPEN', 'CLOSED', 'DRAFT'];
    $status = in_array($status_input, $valid_statuses) ? $status_input : 'OPEN';
    
    error_log('Work type: ' . $work_type . ', Status: ' . $status);
    
    $stmt->bind_param('issssssisssisssssss', 
        $company_id, $title, $description, $requirements, $responsibilities,
        $location, $work_type, $duration_months, $start_date, $end_date, $application_deadline,
        $salary_range, $positions_available, $required_skills, 
        $preferred_qualifications, $contact_person, $contact_email, 
        $contact_phone, $status
    );
    
    $stmt->execute();
    
    send_json(['success' => true, 'message' => 'Internship created successfully']);
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>