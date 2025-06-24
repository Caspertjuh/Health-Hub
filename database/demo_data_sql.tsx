
-- ========================================================================
-- DEMO DATA - DAY PLANNING APPLICATION
-- This file contains demo data for development and testing purposes
-- ========================================================================

-- Demo users
INSERT OR IGNORE INTO users (id, name, avatar) VALUES
('user-1', 'Jan Jansen', '/avatars/user1.png'),
('user-2', 'Petra Peters', '/avatars/user2.png'),
('user-3', 'Thomas Thomassen', '/avatars/user3.png'),
('user-4', 'Sanne Sanders', '/avatars/user4.png'),
('user-5', 'Kees Klaasen', '/avatars/user5.png');

-- User disabilities
INSERT OR IGNORE INTO user_disabilities (user_id, language, planning, sensory, motor, social, cognitive) VALUES
('user-1', TRUE, FALSE, FALSE, TRUE, FALSE, FALSE),
('user-2', FALSE, TRUE, TRUE, FALSE, FALSE, TRUE),
('user-3', FALSE, FALSE, FALSE, FALSE, TRUE, FALSE),
('user-4', TRUE, TRUE, FALSE, FALSE, TRUE, TRUE),
('user-5', FALSE, FALSE, TRUE, TRUE, FALSE, FALSE);

-- User preferences
INSERT OR IGNORE INTO user_preferences (user_id, simplified_language, enhanced_visual_support, high_contrast, larger_text) VALUES
('user-1', TRUE, TRUE, FALSE, TRUE),
('user-2', FALSE, TRUE, TRUE, TRUE),
('user-3', FALSE, FALSE, FALSE, FALSE),
('user-4', TRUE, TRUE, TRUE, TRUE),
('user-5', FALSE, TRUE, FALSE, FALSE);

-- Fixed activity templates
INSERT OR IGNORE INTO activity_templates (id, title, description, category, type, icon, color, location, difficulty) VALUES
('template-fixed-1', 'Ontbijt', 'Ontbijt in de gemeenschappelijke ruimte', 'fixed', 'meal', 'utensils', '#FF9F1C', 'Eetzaal', 'easy'),
('template-fixed-2', 'Medicatie', 'Ochtendmedicatie innemen', 'fixed', 'medication', 'pill', '#2EC4B6', 'Zorgpost', 'easy'),
('template-fixed-3', 'Lunch', 'Lunch in de gemeenschappelijke ruimte', 'fixed', 'meal', 'utensils', '#FF9F1C', 'Eetzaal', 'easy'),
('template-fixed-4', 'Avondeten', 'Diner in de gemeenschappelijke ruimte', 'fixed', 'meal', 'utensils', '#FF9F1C', 'Eetzaal', 'easy');

-- Required support for fixed activity templates
INSERT OR IGNORE INTO template_required_support (template_id, language, planning, sensory, motor, social, cognitive) VALUES
('template-fixed-1', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('template-fixed-2', FALSE, TRUE, FALSE, FALSE, FALSE, FALSE),
('template-fixed-3', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('template-fixed-4', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);

-- Flexible activity templates
INSERT OR IGNORE INTO activity_templates (id, title, description, category, type, icon, color, difficulty) VALUES
('template-flex-1', 'Wandelen', 'Een rustige wandeling buiten', 'flexible', 'exercise', 'walking', '#98FB98', 'easy'),
('template-flex-2', 'Stretchen', 'Eenvoudige rekoefeningen', 'flexible', 'exercise', 'user', '#98FB98', 'easy'),
('template-flex-3', 'Yoga', 'Lichte yogaoefeningen voor ontspanning', 'flexible', 'exercise', 'user', '#98FB98', 'medium'),
('template-flex-4', 'Balspel', 'Eenvoudige spellen met een bal', 'flexible', 'exercise', 'circle', '#98FB98', 'medium'),
('template-flex-5', 'Tuinieren', 'Werken in de tuin', 'flexible', 'exercise', 'leaf', '#98FB98', 'medium'),
('template-flex-6', 'Tekenen', 'Creatieve tekenactiviteit', 'flexible', 'creative', 'palette', '#FFB6C1', 'easy'),
('template-flex-7', 'Kleien', 'Vormen maken met klei', 'flexible', 'creative', 'square', '#FFB6C1', 'medium'),
('template-flex-8', 'Schilderen', 'Creatief bezig zijn met verf', 'flexible', 'creative', 'palette', '#FFB6C1', 'medium'),
('template-flex-9', 'Knutselen', 'Maken van eenvoudige knutselwerkjes', 'flexible', 'creative', 'scissors', '#FFB6C1', 'medium'),
('template-flex-10', 'Collage maken', 'Maken van een collage met tijdschriften', 'flexible', 'creative', 'image', '#FFB6C1', 'easy'),
('template-flex-11', 'Muziek luisteren', 'Ontspannen met je favoriete muziek', 'flexible', 'entertainment', 'music', '#B0C4DE', 'easy'),
('template-flex-12', 'Film kijken', 'Een film of documentaire bekijken', 'flexible', 'entertainment', 'film', '#B0C4DE', 'easy'),
('template-flex-13', 'Verhaal luisteren', 'Luisteren naar een voorgelezen verhaal', 'flexible', 'entertainment', 'book-open', '#B0C4DE', 'easy'),
('template-flex-14', 'Radio luisteren', 'Luisteren naar radioprogramma''s', 'flexible', 'entertainment', 'radio', '#B0C4DE', 'easy'),
('template-flex-15', 'TV-programma kijken', 'Kijken naar een favoriet TV-programma', 'flexible', 'entertainment', 'tv', '#B0C4DE', 'easy'),
('template-flex-16', 'Lezen', 'Een boek of tijdschrift lezen', 'flexible', 'education', 'book', '#DDA0DD', 'medium'),
('template-flex-17', 'Puzzel maken', 'Een puzzel oplossen', 'flexible', 'education', 'puzzle-piece', '#DDA0DD', 'medium'),
('template-flex-18', 'Geheugenspel', 'Oefeningen voor het geheugen', 'flexible', 'education', 'brain', '#DDA0DD', 'medium'),
('template-flex-19', 'Woordspelletjes', 'Spelen met woorden en letters', 'flexible', 'education', 'font', '#DDA0DD', 'medium'),
('template-flex-20', 'Rekenpuzzels', 'Eenvoudige rekenpuzzels oplossen', 'flexible', 'education', 'calculator', '#DDA0DD', 'hard');

-- Required support for flexible activity templates
INSERT OR IGNORE INTO template_required_support (template_id, language, planning, sensory, motor, social, cognitive) VALUES
('template-flex-1', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE),
('template-flex-2', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE),
('template-flex-3', FALSE, TRUE, FALSE, TRUE, FALSE, FALSE),
('template-flex-4', FALSE, FALSE, FALSE, TRUE, TRUE, FALSE),
('template-flex-5', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE),
('template-flex-6', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE),
('template-flex-7', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE),
('template-flex-8', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE),
('template-flex-9', FALSE, TRUE, FALSE, TRUE, FALSE, FALSE),
('template-flex-10', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE),
('template-flex-11', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('template-flex-12', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('template-flex-13', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('template-flex-14', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('template-flex-15', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('template-flex-16', TRUE, FALSE, FALSE, FALSE, FALSE, FALSE),
('template-flex-17', FALSE, FALSE, FALSE, FALSE, FALSE, TRUE),
('template-flex-18', FALSE, FALSE, FALSE, FALSE, FALSE, TRUE),
('template-flex-19', TRUE, FALSE, FALSE, FALSE, FALSE, TRUE),
('template-flex-20', FALSE, FALSE, FALSE, FALSE, FALSE, TRUE);

-- Group activity templates
INSERT OR IGNORE INTO activity_templates (id, title, description, category, type, icon, color, location, difficulty) VALUES
('template-group-1', 'Spelletjesmiddag', 'Gezellig samen bordspellen spelen', 'group', 'social', 'puzzle-piece', '#B0E0E6', 'Activiteitenruimte', 'easy'),
('template-group-2', 'Kookworkshop', 'Samen koken en bakken', 'group', 'creative', 'utensils', '#FFD700', 'Keuken', 'medium'),
('template-group-3', 'Muziektherapie', 'Expressie door muziek en ritme', 'group', 'therapy', 'music', '#E6E6FA', 'Muziekkamer', 'easy'),
('template-group-4', 'Filmavond', 'Samen een film kijken met snacks', 'group', 'entertainment', 'film', '#B0E0E6', 'Recreatieruimte', 'easy'),
('template-group-5', 'Natuurwandeling', 'Wandelen in het nabijgelegen park', 'group', 'exercise', 'tree', '#98FB98', 'Buiten', 'medium'),
('template-group-6', 'Karaoke', 'Samen zingen met karaoke', 'group', 'entertainment', 'mic', '#FFB6C1', 'Recreatieruimte', 'medium'),
('template-group-7', 'Samen tuinieren', 'Werken in de gemeenschappelijke tuin', 'group', 'exercise', 'leaf', '#98FB98', 'Tuin', 'medium'),
('template-group-8', 'Kunstworkshop', 'Creatieve workshop met verschillende materialen', 'group', 'creative', 'palette', '#FFB6C1', 'Kunstkamer', 'easy');

-- Required support for group activity templates
INSERT OR IGNORE INTO template_required_support (template_id, language, planning, sensory, motor, social, cognitive) VALUES
('template-group-1', FALSE, FALSE, FALSE, FALSE, TRUE, FALSE),
('template-group-2', FALSE, TRUE, FALSE, TRUE, TRUE, FALSE),
('template-group-3', FALSE, FALSE, TRUE, FALSE, TRUE, FALSE),
('template-group-4', FALSE, FALSE, TRUE, FALSE, TRUE, FALSE),
('template-group-5', FALSE, FALSE, FALSE, TRUE, TRUE, FALSE),
('template-group-6', TRUE, FALSE, FALSE, FALSE, TRUE, FALSE),
('template-group-7', FALSE, TRUE, FALSE, TRUE, TRUE, FALSE),
('template-group-8', FALSE, FALSE, FALSE, TRUE, TRUE, FALSE);

-- Sample activities for today (adjust the date accordingly)
INSERT OR IGNORE INTO activities (
    id, template_id, user_id, title, description, start_time, end_time, date, location, 
    category, type, icon, color, completed, difficulty
)
SELECT 
    'activity-fixed-1-user-1-' || DATE('now'), 
    'template-fixed-1', 
    'user-1', 
    title, 
    description, 
    '08:00', 
    '09:00', 
    DATE('now'), 
    location, 
    category, 
    type, 
    icon, 
    color, 
    FALSE, 
    difficulty
FROM activity_templates 
WHERE id = 'template-fixed-1';

INSERT OR IGNORE INTO activities (
    id, template_id, user_id, title, description, start_time, end_time, date, location, 
    category, type, icon, color, completed, difficulty
)
SELECT 
    'activity-fixed-3-user-1-' || DATE('now'), 
    'template-fixed-3', 
    'user-1', 
    title, 
    description, 
    '12:30', 
    '13:30', 
    DATE('now'), 
    location, 
    category, 
    type, 
    icon, 
    color, 
    FALSE, 
    difficulty
FROM activity_templates 
WHERE id = 'template-fixed-3';

-- Sample flexible activities for today
INSERT OR IGNORE INTO activities (
    id, template_id, user_id, title, description, start_time, end_time, date, location, 
    category, type, icon, color, completed, difficulty
)
SELECT 
    'activity-flex-1-user-1-' || DATE('now'), 
    'template-flex-1', 
    'user-1', 
    title, 
    description, 
    '10:00', 
    '11:00', 
    DATE('now'), 
    'Buiten', 
    category, 
    type, 
    icon, 
    color, 
    FALSE, 
    difficulty
FROM activity_templates 
WHERE id = 'template-flex-1';

INSERT OR IGNORE INTO activities (
    id, template_id, user_id, title, description, start_time, end_time, date, location, 
    category, type, icon, color, completed, difficulty
)
SELECT 
    'activity-flex-6-user-1-' || DATE('now'), 
    'template-flex-6', 
    'user-1', 
    title, 
    description, 
    '14:00', 
    '15:00', 
    DATE('now'), 
    'Knutselruimte', 
    category, 
    type, 
    icon, 
    color, 
    FALSE, 
    difficulty
FROM activity_templates 
WHERE id = 'template-flex-6';

-- Sample group activity for today
INSERT OR IGNORE INTO activities (
    id, template_id, title, description, start_time, end_time, date, location, 
    category, type, icon, color, completed, difficulty
)
SELECT 
    'activity-group-1-' || DATE('now'), 
    'template-group-1', 
    title, 
    description, 
    '15:30', 
    '17:00', 
    DATE('now'), 
    location, 
    category, 
    type, 
    icon, 
    color, 
    FALSE, 
    difficulty
FROM activity_templates 
WHERE id = 'template-group-1';

-- Set up group activity settings
INSERT OR IGNORE INTO group_activity_settings (activity_id, max_participants)
VALUES ('activity-group-1-' || DATE('now'), 8);

-- Add user to group activity
INSERT OR IGNORE INTO group_activity_participants (activity_id, user_id)
VALUES ('activity-group-1-' || DATE('now'), 'user-1');
