<?php
// Automated Backup System
// Step 1: Foundation Setup - Backup and Recovery

require_once 'config.php';
require_once 'utils.php';

class BackupSystem {
    private $backupPath;
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
        $this->backupPath = __DIR__ . '/backups/';
        
        if (!is_dir($this->backupPath)) {
            mkdir($this->backupPath, 0755, true);
        }
    }
    
    // Create database backup
    public function createDatabaseBackup() {
        $filename = 'db_backup_' . date('Y-m-d_H-i-s') . '.sql';
        $filepath = $this->backupPath . $filename;
        
        try {
            // Simple PHP-based backup instead of mysqldump
            $tables = [];
            $result = $this->conn->query("SHOW TABLES");
            while ($row = $result->fetch_array()) {
                $tables[] = $row[0];
            }
            
            $backup = "-- Database Backup\n-- Generated: " . date('Y-m-d H:i:s') . "\n\n";
            
            foreach ($tables as $table) {
                $backup .= "-- Table: $table\n";
                $backup .= "DROP TABLE IF EXISTS `$table`;\n";
                
                // Get CREATE TABLE statement
                $result = $this->conn->query("SHOW CREATE TABLE `$table`");
                $row = $result->fetch_array();
                $backup .= $row[1] . ";\n\n";
                
                // Get table data
                $result = $this->conn->query("SELECT * FROM `$table`");
                if ($result->num_rows > 0) {
                    $backup .= "INSERT INTO `$table` VALUES\n";
                    $rows = [];
                    while ($row = $result->fetch_array(MYSQLI_NUM)) {
                        $row = array_map(function($value) {
                            return $value === null ? 'NULL' : "'" . $this->conn->real_escape_string($value) . "'";
                        }, $row);
                        $rows[] = '(' . implode(',', $row) . ')';
                    }
                    $backup .= implode(",\n", $rows) . ";\n\n";
                }
            }
            
            file_put_contents($filepath, $backup);
            
            return [
                'success' => true,
                'filename' => basename($filepath),
                'size' => filesize($filepath),
                'path' => $filepath
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    // Create file system backup
    public function createFileBackup($directories = ['uploads']) {
        $filename = 'files_backup_' . date('Y-m-d_H-i-s') . '.json';
        $filepath = $this->backupPath . $filename;
        
        try {
            $backup = [
                'timestamp' => date('Y-m-d H:i:s'),
                'directories' => []
            ];
            
            foreach ($directories as $dir) {
                $fullPath = __DIR__ . '/' . $dir;
                if (is_dir($fullPath)) {
                    $files = glob($fullPath . '/*');
                    $backup['directories'][$dir] = [];
                    foreach ($files as $file) {
                        if (is_file($file)) {
                            $backup['directories'][$dir][] = [
                                'name' => basename($file),
                                'size' => filesize($file),
                                'modified' => date('Y-m-d H:i:s', filemtime($file))
                            ];
                        }
                    }
                }
            }
            
            file_put_contents($filepath, json_encode($backup, JSON_PRETTY_PRINT));
            
            return [
                'success' => true,
                'filename' => basename($filepath),
                'size' => filesize($filepath),
                'path' => $filepath
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    // List available backups
    public function listBackups() {
        $backups = [];
        $files = glob($this->backupPath . '*');
        
        foreach ($files as $file) {
            if (is_file($file)) {
                $backups[] = [
                    'filename' => basename($file),
                    'size' => filesize($file),
                    'created' => date('Y-m-d H:i:s', filemtime($file)),
                    'type' => strpos($file, 'db_backup') !== false ? 'database' : 'files'
                ];
            }
        }
        
        // Sort by creation time (newest first)
        usort($backups, function($a, $b) {
            return strtotime($b['created']) - strtotime($a['created']);
        });
        
        return $backups;
    }
    
    // Clean old backups
    public function cleanOldBackups($daysToKeep = 7) {
        $files = glob($this->backupPath . '*');
        $cutoff = time() - ($daysToKeep * 24 * 60 * 60);
        $deleted = 0;
        
        foreach ($files as $file) {
            if (is_file($file) && filemtime($file) < $cutoff) {
                unlink($file);
                $deleted++;
            }
        }
        
        return $deleted;
    }
    
    // Create full system backup
    public function createFullBackup() {
        $results = [];
        
        // Database backup
        $results['database'] = $this->createDatabaseBackup();
        
        // File backup
        $results['files'] = $this->createFileBackup();
        
        // System info
        $results['system_info'] = [
            'timestamp' => date('Y-m-d H:i:s'),
            'php_version' => PHP_VERSION,
            'mysql_version' => $this->conn->server_info,
            'backup_path' => $this->backupPath
        ];
        
        return $results;
    }
}

// Handle backup operations if called directly
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    $backup = new BackupSystem($conn);
    $action = $_GET['action'] ?? 'list';
    
    switch ($action) {
        case 'create':
        case 'auto':
            $result = $backup->createFullBackup();
            break;
            
        case 'database':
            $result = $backup->createDatabaseBackup();
            break;
            
        case 'files':
            $result = $backup->createFileBackup();
            break;
            
        case 'list':
            $result = $backup->listBackups();
            break;
            
        case 'cleanup':
            $deleted = $backup->cleanOldBackups();
            $result = ['message' => "Deleted $deleted old backup files"];
            break;
            
        default:
            $result = ['error' => 'Invalid action'];
    }
    
    header('Content-Type: application/json');
    echo json_encode($result, JSON_PRETTY_PRINT);
}
?>