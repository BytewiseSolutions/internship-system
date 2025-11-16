<?php
// System Monitoring and Logging
// Step 1: Foundation Setup - Error Logging and Monitoring

require_once 'config.php';
require_once 'utils.php';

class SystemMonitor {
    private $logPath;
    
    public function __construct() {
        $this->logPath = __DIR__ . '/logs/';
        if (!is_dir($this->logPath)) {
            mkdir($this->logPath, 0755, true);
        }
    }
    
    // Log system events
    public function logEvent($level, $message, $context = []) {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'level' => strtoupper($level),
            'message' => $message,
            'context' => $context,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown'
        ];
        
        $logFile = $this->logPath . date('Y-m-d') . '.log';
        file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);
        
        // Also log to PHP error log for critical errors
        if (in_array($level, ['error', 'critical', 'alert', 'emergency'])) {
            error_log("[$level] $message - " . json_encode($context));
        }
    }
    
    // Monitor system performance
    public function getSystemStats() {
        return [
            'memory_usage' => [
                'current' => memory_get_usage(true),
                'peak' => memory_get_peak_usage(true),
                'limit' => ini_get('memory_limit')
            ],
            'execution_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'],
            'database_queries' => $this->getDatabaseStats(),
            'disk_space' => [
                'free' => disk_free_space(__DIR__),
                'total' => disk_total_space(__DIR__)
            ],
            'php_version' => PHP_VERSION,
            'server_load' => sys_getloadavg()
        ];
    }
    
    // Get database performance stats
    private function getDatabaseStats() {
        global $conn;
        
        try {
            $result = $conn->query("SHOW STATUS LIKE 'Queries'");
            $queries = $result->fetch_assoc()['Value'] ?? 0;
            
            $result = $conn->query("SHOW STATUS LIKE 'Uptime'");
            $uptime = $result->fetch_assoc()['Value'] ?? 1;
            
            return [
                'total_queries' => $queries,
                'queries_per_second' => round($queries / $uptime, 2),
                'uptime' => $uptime
            ];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
    
    // Security monitoring
    public function checkSecurityThreats() {
        $threats = [];
        
        // Check for SQL injection attempts
        $input = file_get_contents('php://input');
        $suspicious_patterns = [
            '/union\s+select/i',
            '/drop\s+table/i',
            '/delete\s+from/i',
            '/<script/i',
            '/javascript:/i'
        ];
        
        foreach ($suspicious_patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                $threats[] = 'Suspicious input detected: ' . $pattern;
            }
        }
        
        // Check for unusual request patterns
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            if (strlen($input) > 1000000) { // 1MB
                $threats[] = 'Unusually large POST request';
            }
        }
        
        // Log threats
        if (!empty($threats)) {
            $this->logEvent('warning', 'Security threats detected', [
                'threats' => $threats,
                'request_data' => substr($input, 0, 1000)
            ]);
        }
        
        return $threats;
    }
    
    // Health check endpoint
    public function healthCheck() {
        global $conn;
        
        $health = [
            'status' => 'healthy',
            'timestamp' => date('Y-m-d H:i:s'),
            'checks' => []
        ];
        
        // Database check
        try {
            $conn->query("SELECT 1");
            $health['checks']['database'] = 'ok';
        } catch (Exception $e) {
            $health['checks']['database'] = 'error: ' . $e->getMessage();
            $health['status'] = 'unhealthy';
        }
        
        // File system check
        if (is_writable($this->logPath)) {
            $health['checks']['filesystem'] = 'ok';
        } else {
            $health['checks']['filesystem'] = 'error: log directory not writable';
            $health['status'] = 'unhealthy';
        }
        
        // Memory check
        $memoryUsage = memory_get_usage(true);
        $memoryLimit = ini_get('memory_limit');
        $memoryLimitBytes = $this->convertToBytes($memoryLimit);
        
        if ($memoryUsage < $memoryLimitBytes * 0.8) {
            $health['checks']['memory'] = 'ok';
        } else {
            $health['checks']['memory'] = 'warning: high memory usage';
            $health['status'] = 'degraded';
        }
        
        return $health;
    }
    
    // Convert memory limit to bytes
    private function convertToBytes($val) {
        $val = trim($val);
        $last = strtolower($val[strlen($val)-1]);
        $val = (int)$val;
        
        switch($last) {
            case 'g': $val *= 1024;
            case 'm': $val *= 1024;
            case 'k': $val *= 1024;
        }
        
        return $val;
    }
    
    // Clean old logs
    public function cleanOldLogs($daysToKeep = 30) {
        $files = glob($this->logPath . '*.log');
        $cutoff = time() - ($daysToKeep * 24 * 60 * 60);
        $deleted = 0;
        
        foreach ($files as $file) {
            if (filemtime($file) < $cutoff) {
                unlink($file);
                $deleted++;
            }
        }
        
        return $deleted;
    }
}

// Initialize monitor
$monitor = new SystemMonitor();

// Handle monitoring endpoints
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    $action = $_GET['action'] ?? 'health';
    
    switch ($action) {
        case 'health':
            header('Content-Type: application/json');
            echo json_encode($monitor->healthCheck(), JSON_PRETTY_PRINT);
            break;
            
        case 'stats':
            header('Content-Type: application/json');
            echo json_encode($monitor->getSystemStats(), JSON_PRETTY_PRINT);
            break;
            
        case 'security':
            header('Content-Type: application/json');
            $threats = $monitor->checkSecurityThreats();
            echo json_encode(['threats' => $threats], JSON_PRETTY_PRINT);
            break;
            
        case 'cleanup':
            $deleted = $monitor->cleanOldLogs();
            header('Content-Type: application/json');
            echo json_encode(['message' => "Deleted $deleted old log files"], JSON_PRETTY_PRINT);
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
}
?>