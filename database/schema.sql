
-- ========================================================================
-- DATABASE SCHEMA - DAY PLANNING APPLICATION
-- Developers: Jesse Hummel, Remco Pruim, Tjitte Timmerman, Casper Oudman
-- Target completion date: June 23, 2025
-- ========================================================================

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disability profiles for users
CREATE TABLE IF NOT EXISTS user_disabilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    language BOOLEAN DEFAULT FALSE,
    planning BOOLEAN DEFAULT FALSE,
    sensory BOOLEAN DEFAULT FALSE,
    motor BOOLEAN DEFAULT FALSE,
    social BOOLEAN DEFAULT FALSE,
    cognitive BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    simplified_language BOOLEAN DEFAULT FALSE,
    enhanced_visual_support BOOLEAN DEFAULT FALSE,
    high_contrast BOOLEAN DEFAULT FALSE,
    larger_text BOOLEAN DEFAULT FALSE,
    reduced_motion BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activity templates
CREATE TABLE IF NOT EXISTS activity_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('fixed', 'flexible', 'group')),
    type TEXT NOT NULL CHECK (type IN ('hygiene', 'meal', 'medication', 'therapy', 'exercise', 'social', 'entertainment', 'creative', 'education', 'other')),
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    location TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Required support for activity templates
CREATE TABLE IF NOT EXISTS template_required_support (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id TEXT NOT NULL,
    language BOOLEAN DEFAULT FALSE,
    planning BOOLEAN DEFAULT FALSE,
    sensory BOOLEAN DEFAULT FALSE,
    motor BOOLEAN DEFAULT FALSE,
    social BOOLEAN DEFAULT FALSE,
    cognitive BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (template_id) REFERENCES activity_templates(id) ON DELETE CASCADE
);

-- Activities (instances of templates)
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL,
    user_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    start_time TEXT,
    end_time TEXT,
    date TEXT,
    location TEXT,
    category TEXT NOT NULL CHECK (category IN ('fixed', 'flexible', 'group')),
    type TEXT NOT NULL CHECK (type IN ('hygiene', 'meal', 'medication', 'therapy', 'exercise', 'social', 'entertainment', 'creative', 'education', 'other')),
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES activity_templates(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Required support for specific activities (if different from template)
CREATE TABLE IF NOT EXISTS activity_required_support (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id TEXT NOT NULL,
    language BOOLEAN DEFAULT FALSE,
    planning BOOLEAN DEFAULT FALSE,
    sensory BOOLEAN DEFAULT FALSE,
    motor BOOLEAN DEFAULT FALSE,
    social BOOLEAN DEFAULT FALSE,
    cognitive BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- Group activity participants
CREATE TABLE IF NOT EXISTS group_activity_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (activity_id, user_id)
);

-- Group activity settings
CREATE TABLE IF NOT EXISTS group_activity_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id TEXT NOT NULL,
    max_participants INTEGER,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- Activity history for tracking past activities
CREATE TABLE IF NOT EXISTS activity_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completion_time TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admin users for application management
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Settings for application-wide configuration
CREATE TABLE IF NOT EXISTS app_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_template_id ON activities(template_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_group_participants_activity ON group_activity_participants(activity_id);
CREATE INDEX IF NOT EXISTS idx_group_participants_user ON group_activity_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_disabilities_user ON user_disabilities(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_history_user ON activity_history(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_history_date ON activity_history(date);

-- Triggers to update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_activity_templates_timestamp 
AFTER UPDATE ON activity_templates
BEGIN
    UPDATE activity_templates SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_activities_timestamp 
AFTER UPDATE ON activities
BEGIN
    UPDATE activities SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO admin_users (username, password_hash, name)
VALUES ('admin', '$2b$10$rHxo9VFIj9X5PUEJQfVJ4OvRonQdY/h1Kc4YC3H5JV7vJJ8QxLOQm', 'Administrator');

-- Insert default app settings
INSERT OR IGNORE INTO app_settings (key, value, description)
VALUES 
('app_name', 'Dagplanning Applicatie', 'Name of the application'),
('organization_name', 'Dagbesteding Centrum', 'Name of the organization'),
('default_language', 'nl-NL', 'Default language for the application'),
('max_users_per_page', '10', 'Maximum number of users to display per page'),
('auto_generate_schedules', 'true', 'Automatically generate schedules for users');
