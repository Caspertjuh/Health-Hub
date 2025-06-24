
CREATE TABLE template_required_support (
    template_id TEXT PRIMARY KEY,
    language BOOLEAN DEFAULT 0,
    planning BOOLEAN DEFAULT 0,
    sensory BOOLEAN DEFAULT 0,
    motor BOOLEAN DEFAULT 0,
    social BOOLEAN DEFAULT 0,
    cognitive BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES activity_templates(id) ON DELETE CASCADE
);
