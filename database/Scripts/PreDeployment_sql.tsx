
/*
 Pre-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be executed before the build script.	
 Use SQLCMD syntax to include a file in the pre-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the pre-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/

-- Drop existing objects if they exist (for clean installation)
-- This ensures we have a clean state before creating new objects

PRAGMA foreign_keys = OFF;

-- Drop tables if they exist
DROP TABLE IF EXISTS group_activity_participants;
DROP TABLE IF EXISTS group_activity_settings;
DROP TABLE IF EXISTS activity_required_support;
DROP TABLE IF EXISTS template_required_support;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS user_disabilities;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS activity_templates;
DROP TABLE IF EXISTS users;

PRAGMA foreign_keys = ON;
