-- Add sync tables to support web-mobile synchronization

CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    session_data TEXT,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_device (user_id, device_id),
    INDEX idx_user_active (user_id, last_active)
);

CREATE TABLE IF NOT EXISTS sync_conflicts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    conflict_data JSON,
    resolution_status ENUM('pending', 'resolved', 'ignored') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, resolution_status)
);

CREATE TABLE IF NOT EXISTS data_changes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    change_type ENUM('insert', 'update', 'delete') NOT NULL,
    old_data JSON,
    new_data JSON,
    device_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_table_time (user_id, table_name, created_at)
);