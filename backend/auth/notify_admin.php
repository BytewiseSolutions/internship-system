<?php
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../cors.php";
require_once __DIR__ . "/../utils.php";

function notifyAdmins($role = "Unknown")
{
    global $conn;

    $subject = "New Registration Request";
    $body = "Hello Admin,\n\nA new $role registration request needs your approval.\n\nThanks,\nInternship Management System";
    $notificationMessage = "A new $role registration request needs your approval.";

    try {
        $stmtAdmins = $conn->prepare("SELECT id, email FROM users WHERE role = ? AND status = 'ACTIVE'");
        $roleAdmin = "ADMIN";
        $stmtAdmins->bind_param("s", $roleAdmin);
        $stmtAdmins->execute();
        $result = $stmtAdmins->get_result();
        $admins = $result->fetch_all(MYSQLI_ASSOC);

        if (!$admins) {
            return ["message" => "No admins found to notify."];
        }

        foreach ($admins as $admin) {
            $adminId = $admin['id'];
            $adminEmail = $admin['email'];

            if ($adminEmail === $_ENV['MAIL_FROM'])
                continue;

            if (!sendMail($adminEmail, $subject, $body)) {
                error_log("Failed to send email to $adminEmail");
            }

            $stmtNotify = $conn->prepare(
                "INSERT INTO notifications (user_id, message, is_read, created_at) VALUES (?, ?, 0, NOW())"
            );
            $stmtNotify->execute([$adminId, $notificationMessage]);
        }
        sendMail($_ENV['MAIL_FROM'], $subject . " (Copy)", $body);

        return ["message" => "Notification sent to all admins successfully."];
    } catch (Exception $e) {
        error_log($e->getMessage());
        return ["message" => "Internal server error: " . $e->getMessage()];
    }
}