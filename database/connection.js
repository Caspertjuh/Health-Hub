/**
 * Database connection configuration
 * This file handles the connection to the SQLite database
 */

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure database directory exists
const dbDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database file path
const dbPath = process.env.DB_PATH || path.join(dbDir, 'day-planning-app.db');

// Initialize database connection
async function getDbConnection() {
  try {
    // Open database connection with promise interface
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');
    
    // Check if database needs initialization
    const initialized = await isDbInitialized(db);
    
    if (!initialized) {
      await initializeDatabase(db);
    }
    
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// Check if database has been initialized
async function isDbInitialized(db) {
  try {
    // Check if users table exists
    const result = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );
    return !!result;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
}

// Initialize database with schema
async function initializeDatabase(db) {
  try {
    console.log('Initializing database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Run schema as a transaction
    await db.exec('BEGIN TRANSACTION');
    await db.exec(schema);
    await db.exec('COMMIT');
    
    console.log('Database initialized successfully');
    
    // Create demo data if needed
    if (process.env.DB_DEMO_DATA === 'true') {
      await createDemoData(db);
    }
    
    return true;
  } catch (error) {
    // Rollback on error
    await db.exec('ROLLBACK');
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Create demo data for development
async function createDemoData(db) {
  try {
    console.log('Creating demo data...');
    
    // Read demo data file
    const demoDataPath = path.join(__dirname, 'demo-data.sql');
    
    if (fs.existsSync(demoDataPath)) {
      const demoData = fs.readFileSync(demoDataPath, 'utf8');
      
      // Run demo data as a transaction
      await db.exec('BEGIN TRANSACTION');
      await db.exec(demoData);
      await db.exec('COMMIT');
      
      console.log('Demo data created successfully');
    } else {
      console.warn('Demo data file not found at', demoDataPath);
    }
    
    return true;
  } catch (error) {
    // Rollback on error
    await db.exec('ROLLBACK');
    console.error('Demo data creation failed:', error);
    throw error;
  }
}

// Export the database connection
module.exports = {
  getDbConnection
};