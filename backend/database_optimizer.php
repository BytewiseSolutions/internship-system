<?php

require_once 'config.php';

class DatabaseOptimizer {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    public function addPerformanceIndexes() {
        $indexes = [
            'idx_users_email' => "CREATE INDEX idx_users_email ON users(email)",
            'idx_users_role' => "CREATE INDEX idx_users_role ON users(role)",
            'idx_users_status' => "CREATE INDEX idx_users_status ON users(status)",
            'idx_internships_company_id' => "CREATE INDEX idx_internships_company_id ON internships(company_id)",
            'idx_internships_status' => "CREATE INDEX idx_internships_status ON internships(status)",
            'idx_applications_internship_id' => "CREATE INDEX idx_applications_internship_id ON applications(internship_id)",
            'idx_applications_student_id' => "CREATE INDEX idx_applications_student_id ON applications(student_id)",
            'idx_applications_status' => "CREATE INDEX idx_applications_status ON applications(status)",
            'idx_notifications_user_id' => "CREATE INDEX idx_notifications_user_id ON notifications(user_id)"
        ];
        
        $results = [];
        foreach ($indexes as $indexName => $indexQuery) {
            try {
                preg_match('/ON\s+(\w+)\s*\(/', $indexQuery, $matches);
                $tableName = $matches[1] ?? '';
                
                if ($tableName) {
                    $checkQuery = "SHOW INDEX FROM `$tableName` WHERE Key_name = '$indexName'";
                    $result = $this->conn->query($checkQuery);
                    
                    if ($result && $result->num_rows == 0) {
                        $this->conn->query($indexQuery);
                        $results[] = "✓ Created index: $indexName";
                    } else {
                        $results[] = "✓ Index exists: $indexName";
                    }
                } else {
                    $results[] = "✗ Could not parse table name from: $indexQuery";
                }
            } catch (Exception $e) {
                try {
                    $this->conn->query($indexQuery);
                    $results[] = "✓ Created index: $indexName";
                } catch (Exception $e2) {
                    if (strpos($e2->getMessage(), 'Duplicate key name') !== false) {
                        $results[] = "✓ Index exists: $indexName";
                    } else {
                        $results[] = "✗ Error creating $indexName: " . $e2->getMessage();
                    }
                }
            }
        }
        
        return $results;
    }
    public function optimizeConfiguration() {
        $optimizations = [
            "SET SESSION wait_timeout = 28800",
            "SET SESSION interactive_timeout = 28800",
            "SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'"
        ];
        
        $results = [];
        foreach ($optimizations as $optimization) {
            try {
                $this->conn->query($optimization);
                $results[] = "✓ " . $optimization;
            } catch (Exception $e) {
                $results[] = "✗ " . $optimization . " - " . $e->getMessage();
            }
        }
        
        return $results;
    }
    public function analyzeSlowQueries() {
        $queries = [
            "SHOW VARIABLES LIKE 'slow_query_log'",
            "SHOW VARIABLES LIKE 'long_query_time'",
            "SHOW VARIABLES LIKE 'log_queries_not_using_indexes'"
        ];
        
        $results = [];
        foreach ($queries as $query) {
            try {
                $result = $this->conn->query($query);
                while ($row = $result->fetch_assoc()) {
                    $results[] = $row['Variable_name'] . ': ' . $row['Value'];
                }
            } catch (Exception $e) {
                $results[] = "Error analyzing: " . $e->getMessage();
            }
        }
        
        return $results;
    }
    public function cleanupOldData() {
        $cleanupQueries = [
            "DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) AND is_read = 1",

            "DELETE FROM internships WHERE status = 'CLOSED' AND updated_at < DATE_SUB(NOW(), INTERVAL 90 DAY)",
            
            "DELETE FROM applications WHERE internship_id NOT IN (SELECT internship_id FROM internships)",
            "DELETE FROM logbook WHERE student_id NOT IN (SELECT student_id FROM students)"
        ];
        
        $results = [];
        foreach ($cleanupQueries as $query) {
            try {
                $this->conn->query($query);
                $affected = $this->conn->affected_rows;
                $results[] = "✓ Cleaned up $affected records: " . substr($query, 0, 50) . "...";
            } catch (Exception $e) {
                $results[] = "✗ Cleanup error: " . $e->getMessage();
            }
        }
        
        return $results;
    }
    public function getDatabaseStats() {
        $stats = [];

        $tables = ['users', 'students', 'companies', 'internships', 'applications', 'logbook', 'notifications'];
        foreach ($tables as $table) {
            try {
                $result = $this->conn->query("SELECT COUNT(*) as count FROM $table");
                $row = $result->fetch_assoc();
                $stats[$table] = $row['count'];
            } catch (Exception $e) {
                $stats[$table] = 'Error: ' . $e->getMessage();
            }
        }
        
        try {
            $result = $this->conn->query("
                SELECT 
                    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size (MB)'
                FROM information_schema.tables 
                WHERE table_schema = 'internship_system'
            ");
            $row = $result->fetch_assoc();
            $stats['database_size_mb'] = $row['DB Size (MB)'];
        } catch (Exception $e) {
            $stats['database_size_mb'] = 'Error: ' . $e->getMessage();
        }
        
        return $stats;
    }
    public function runFullOptimization() {
        $results = [
            'indexes' => $this->addPerformanceIndexes(),
            'configuration' => $this->optimizeConfiguration(),
            'cleanup' => $this->cleanupOldData(),
            'stats' => $this->getDatabaseStats(),
            'slow_queries' => $this->analyzeSlowQueries()
        ];
        
        return $results;
    }
}
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    $optimizer = new DatabaseOptimizer($conn);
    $results = $optimizer->runFullOptimization();
    
    header('Content-Type: application/json');
    echo json_encode([
        'message' => 'Database optimization completed',
        'results' => $results,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);
}
?>