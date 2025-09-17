<?php
require __DIR__ . '/../phpmailer/src/PHPMailer.php';
require __DIR__ . '/../phpmailer/src/SMTP.php';
require __DIR__ . '/../phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function send_json($data, $status = 200)
{
    http_response_code($status);
    header("Content-Type: application/json");
    echo json_encode($data);
    exit();
}
function generateToken($email, $role)
{
    $payload = [
        "email" => $email,
        "role" => $role,
        "iat" => time(),
        "exp" => time() + (60 * 60 * 24)
    ];
    return base64_encode(json_encode($payload));
}
function decodeToken($token)
{
    if (!$token)
        return [];
    $decoded = base64_decode($token, true);
    if (!$decoded)
        return [];
    $payload = json_decode($decoded, true);
    if (!is_array($payload))
        return [];
    return $payload;
}
function sendMail($to, $subject, $body)
{
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'monamane.lebohang45@gmail.com';
        $mail->Password = 'gaxp yyhb iodh uhix';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('monamane.lebohang45@gmail.com', 'Internship System');
        $mail->addAddress($to);

        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo);
        return false;
    }
}
?>