
CREATE TABLE activity_required_support (
    activity_id TEXT PRIMARY KEY,
    language BOOLEAN DEFAULT 0,
    planning BOOLEAN DEFAULT 0,
    sensory BOOLEAN DEFAULT 0,
    motor BOOLEAN DEFAULT 0,
    social BOOLEAN DEFAULT 0,
    cognitive BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);
