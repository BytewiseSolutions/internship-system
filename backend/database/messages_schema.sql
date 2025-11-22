-- Messages table for real-time messaging
CREATE TABLE IF NOT EXISTS messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    message_type ENUM('text', 'file', 'image') DEFAULT 'text',
    file_path VARCHAR(255) NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_sender_receiver (sender_id, receiver_id),
    INDEX idx_created_at (created_at)
);

-- Conversations table for chat threads
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    participant1_id INT NOT NULL,
    participant2_id INT NOT NULL,
    last_message_id INT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant1_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (participant2_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (last_message_id) REFERENCES messages(message_id) ON DELETE SET NULL,
    UNIQUE KEY unique_participants (LEAST(participant1_id, participant2_id), GREATEST(participant1_id, participant2_id))
);