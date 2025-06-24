
# Database Documentation

This directory contains the database schema, scripts, and SQL Project files for the Dagplanning Application.

## Overview

The application uses SQLite as its database engine, which provides a lightweight, file-based relational database. The database schema is defined in the `schema.sql` file and is implemented using the SQL Project structure for better development experience in Visual Studio.

## Structure

- `DagplanningApp.sqlproj` - Visual Studio SQL Project file
- `schema.sql` - Complete database schema definition
- `demo_data_sql.tsx` - Demo data for testing
- `dbo/Tables/` - Individual table definitions
- `Scripts/` - Pre and post-deployment scripts

## Database Schema

The database consists of the following main tables:

1. `users` - User profiles
2. `user_disabilities` - User disability settings
3. `user_preferences` - User interface preferences
4. `activity_templates` - Templates for activities
5. `template_required_support` - Support requirements for templates
6. `activities` - Individual scheduled activities
7. `activity_required_support` - Support requirements for individual activities
8. `group_activity_settings` - Settings for group activities
9. `group_activity_participants` - Participants in group activities

## Working with the SQL Project

### Opening in Visual Studio

1. Open Visual Studio
2. Select File > Open > Project/Solution
3. Navigate to the project folder and open the `DagplanningApp.sln` file
4. The SQL Project will load in the Solution Explorer

### Making Schema Changes

1. Edit the table definition files in the `dbo/Tables` folder
2. Build the project to validate your changes
3. Deploy the changes to a test database

### Generating Scripts

1. Right-click on the project in Solution Explorer
2. Select "Publish..."
3. Configure the publish settings for your target
4. Click "Generate Script" to create a deployment script

## SQLite Specifics

While the SQL Project is designed for SQL Server compatibility, the actual implementation uses SQLite. Some key differences to note:

- Data types: SQLite uses dynamic typing with type affinity
- Foreign keys: Must be explicitly enabled with `PRAGMA foreign_keys = ON;`
- Auto-increment: SQLite uses `AUTOINCREMENT` instead of `IDENTITY`
- Indexes: Created separately from table definitions

## Integration with the Application

The database is accessed through the Node.js backend using the `sqlite3` package. The connection is managed in the `database/connection_js.tsx` file.

## Database Initialization

The database is initialized using the script in `scripts/initDb_js.tsx`, which:

1. Creates the database file if it doesn't exist
2. Executes the schema.sql script
3. Loads demo data if configured
4. Sets up initial indexes and optimizations

## Migration from localStorage

To migrate existing data from localStorage to the database, use the script in `scripts/migrate_localstorage_js.tsx`.
