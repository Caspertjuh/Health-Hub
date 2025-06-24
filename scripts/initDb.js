/**
 * Database initialization script
 * This script initializes the database schema and creates demo data
 */

const { getDbConnection } = require('../database/connection');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function initializeDatabase() {
  console.log('Starting database initialization...');
  
  try {
    // Get database connection (this will initialize if needed)
    const db = await getDbConnection();
    
    // Check if database has tables
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    
    console.log(`Found ${tables.length} tables in the database:`);
    tables.forEach(table => console.log(`- ${table.name}`));
    
    // Check admin users
    const adminCount = await db.get('SELECT COUNT(*) as count FROM admin_users');
    console.log(`Found ${adminCount.count} admin users`);
    
    // Check users
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    console.log(`Found ${userCount.count} users`);
    
    // Check activity templates
    const templateCount = await db.get('SELECT COUNT(*) as count FROM activity_templates');
    console.log(`Found ${templateCount.count} activity templates`);
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase().then(() => {
  console.log('Database initialization script completed');
  process.exit(0);
});