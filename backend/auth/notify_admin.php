<?php
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../cors.php";
require_once __DIR__ . "/../utils.php";

function notifyAdmins($role = "Unknown")
{
    global $conn;

    $subject = "New Registration Request";
    $body = "Hello Admin,\n\nA new $role registration request needs your approval.\n\nThanks,\nInternship System";
    $notificationMessage = "A new $role registration request needs your approval.";

    try {
        $stmtAdmins = $conn->prepare("SELECT id, email FROM users WHERE role = ? AND status = 'ACTIVE'");
        $stmtAdmins->bind_param("s", $roleAdmin);
        $roleAdmin = "ADMIN";

        if (!$stmtAdmins->execute()) {
            throw new Exception("Failed to execute admin query: " . $stmtAdmins->error);
        }

        $result = $stmtAdmins->get_result();
        $admins = $result->fetch_all(MYSQLI_ASSOC);

        if (!$admins) {
            return ["message" => "No admins found to notify."];
        }

        foreach ($admins as $admin) {
            $adminId = $admin['id'];
            $adminEmail = $admin['email'];

            if (!sendMail($adminEmail, $subject, $body)) {
                throw new Exception("Failed to send email to $adminEmail");
            }

            $stmtNotify = $conn->prepare(
                "INSERT INTO notifications (user_id, message, is_read, created_at) VALUES (?, ?, 0, NOW())"
            );
            if (!$stmtNotify) {
                throw new Exception("Failed to prepare notification insert: " . $conn->error);
            }

            if (!$stmtNotify->execute([$adminId, $notificationMessage])) {
                throw new Exception("Failed to insert notification: " . $stmtNotify->error);
            }
        }

        return ["message" => "Notification sent to all admins successfully."];

    } catch (Exception $e) {
        error_log($e->getMessage());
        return ["message" => "Internal server error: " . $e->getMessage()];
    }
}
