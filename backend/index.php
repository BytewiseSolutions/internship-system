<?php
require 'cors.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$dbExists = $conn->select_db('internshipdb');
if (!$dbExists) {
    require_once __DIR__ . '/setup.php';
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/backend#', '', $path);

switch ($path) {
    // Root files
    case '/register':
    case '/register.php':
        require 'register.php';
        break;
    case '/login':
    case '/login.php':
        require 'login.php';
        break;

    // Auth endpoints
    case '/auth/all_users.php':
        require 'auth/all_users.php';
        break;
    case '/auth/pending-users.php':
        require 'auth/pending-users.php';
        break;
    case '/auth/approve.php':
        require 'auth/approve.php';
        break;
    case '/auth/reject.php':
        require 'auth/reject.php';
        break;
    case '/auth/suspend.php':
        require 'auth/suspend.php';
        break;
    case '/auth/unsuspend.php':
        require 'auth/unsuspend.php';
        break;
    case '/auth/register-company-user.php':
        require 'auth/register-company-user.php';
        break;
    case '/auth/register-company-details.php':
        require 'auth/register-company-details.php';
        break;
    case '/auth/notify-admin.php':
        require 'auth/notify-admin.php';
        break;

    // Applications endpoints
    case '/applications/get_applications.php':
        require 'applications/get_applications.php';
        break;
    case '/applications/get_all_applications.php':
        require 'applications/get_all_applications.php';
        break;
    case '/applications/add_application.php':
        require 'applications/add_application.php';
        break;
    case '/applications/update_application.php':
        require 'applications/update_application.php';
        break;
    case '/applications/update_application_status.php':
        require 'applications/update_application_status.php';
        break;
    case '/applications/track_applications.php':
        require 'applications/track_applications.php';
        break;
    case '/applications/accepted_internships.php':
        require 'applications/accepted_internships.php';
        break;

    // Internships endpoints
    case '/internships/get_internships.php':
        require 'internships/get_internships.php';
        break;
    case '/internships/get_available_internships.php':
        require 'internships/get_available_internships.php';
        break;
    case '/internships/add_internship.php':
        require 'internships/add_internship.php';
        break;
    case '/internships/update_internship.php':
        require 'internships/update_internship.php';
        break;
    case '/internships/delete_internship.php':
        require 'internships/delete_internship.php';
        break;
    case '/internships/get_companies.php':
        require 'internships/get_companies.php';
        break;

    // Company endpoints
    case '/company/get_companies.php':
        require 'company/get_companies.php';
        break;
    case '/company/add_company.php':
        require 'company/add_company.php';
        break;
    case '/company/update_company.php':
        require 'company/update_company.php';
        break;
    case '/company/delete_company.php':
        require 'company/delete_company.php';
        break;
    case '/company/get-company.php':
        require 'company/get-company.php';
        break;
    case '/company/update-company-status.php':
        require 'company/update-company-status.php';
        break;
    case '/company/company_stats.php':
        require 'company/company_stats.php';
        break;
    case '/company/recent_internships.php':
        require 'company/recent_internships.php';
        break;
    case '/company/recent_applications.php':
        require 'company/recent_applications.php';
        break;

    // Reviews endpoints
    case '/reviews/get_reviews.php':
        require 'reviews/get_reviews.php';
        break;
    case '/reviews/get_student_reviews.php':
        require 'reviews/get_student_reviews.php';
        break;
    case '/reviews/get_company_reviews.php':
        require 'reviews/get_company_reviews.php';
        break;
    case '/reviews/create_review.php':
        require 'reviews/create_review.php';
        break;
    case '/reviews/delete_review.php':
        require 'reviews/delete_review.php';
        break;
    case '/reviews/moderate_review.php':
        require 'reviews/moderate_review.php';
        break;
    case '/reviews/reply_review.php':
        require 'reviews/reply_review.php';
        break;

    // Students endpoints
    case '/students/get_dashboard_stats.php':
        require 'students/get_dashboard_stats.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found", "path" => $path]);
        break;
}
