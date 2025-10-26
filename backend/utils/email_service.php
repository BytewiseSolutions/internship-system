<?php
class EmailService {
    private $from_email = 'noreply@internship-system.ls';
    private $from_name = 'Internship Management System';
    
    public function sendApplicationNotification($to_email, $student_name, $internship_title) {
        $subject = "New Application Received - $internship_title";
        $message = "
        <h2>New Internship Application</h2>
        <p>You have received a new application from <strong>$student_name</strong> for the position: <strong>$internship_title</strong></p>
        <p>Please log in to your dashboard to review the application.</p>
        ";
        
        return $this->sendEmail($to_email, $subject, $message);
    }
    
    public function sendStatusUpdate($to_email, $student_name, $internship_title, $status) {
        $subject = "Application Status Update - $internship_title";
        $message = "
        <h2>Application Status Update</h2>
        <p>Dear $student_name,</p>
        <p>Your application for <strong>$internship_title</strong> has been <strong>$status</strong>.</p>
        <p>Please log in to your dashboard for more details.</p>
        ";
        
        return $this->sendEmail($to_email, $subject, $message);
    }
    
    private function sendEmail($to, $subject, $message) {
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: {$this->from_name} <{$this->from_email}>" . "\r\n";
        
        return mail($to, $subject, $message, $headers);
    }
}
?>