
/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/

-- Load initial data if needed
-- :r .\Seed\InitialData.sql

-- Create admin user if it doesn't exist
INSERT OR IGNORE INTO users (id, name, avatar)
VALUES ('admin', 'Administrator', NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_template_id ON activities(template_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_group_participants_activity ON group_activity_participants(activity_id);
CREATE INDEX IF NOT EXISTS idx_group_participants_user ON group_activity_participants(user_id);

-- Enable WAL mode for better performance
PRAGMA journal_mode = WAL;

-- Set user_version to track schema version
PRAGMA user_version = 1;

-- Output success message
SELECT 'Database setup completed successfully.' AS Message;
