
CREATE TABLE user_preferences (
    user_id TEXT PRIMARY KEY,
    simplified_language BOOLEAN DEFAULT 0,
    enhanced_visual_support BOOLEAN DEFAULT 0,
    high_contrast BOOLEAN DEFAULT 0,
    larger_text BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
