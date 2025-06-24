
CREATE TABLE activities (
    id TEXT PRIMARY KEY,
    template_id TEXT,
    user_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    start_time TEXT,
    end_time TEXT,
    date TEXT,
    location TEXT,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    completed BOOLEAN DEFAULT 0,
    difficulty TEXT DEFAULT 'easy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES activity_templates(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
