
/**
 * Database initialization script
 * Run with: npm run init-db
 */

const fs = require('fs');
const path = require('path');
const { getDbConnection } = require('../database/connection');

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Get database connection (this will initialize the database if needed)
    const db = await getDbConnection();
    
    // Get database statistics
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    const templateCount = await db.get('SELECT COUNT(*) as count FROM activity_templates');
    const activityCount = await db.get('SELECT COUNT(*) as count FROM activities');
    
    console.log('\nDatabase initialization completed successfully!');
    console.log('=============================================');
    console.log('Database Statistics:');
    console.log(`- Users: ${userCount.count}`);
    console.log(`- Activity Templates: ${templateCount.count}`);
    console.log(`- Activities: ${activityCount.count}`);
    console.log('=============================================\n');
    
    // Create demo data if this is a development environment
    if (process.env.NODE_ENV === 'development' || process.argv.includes('--with-demo-data')) {
      console.log('Creating demo data...');
      
      // Read demo data file
      const demoDataPath = path.join(__dirname, '../database/demo-data.sql');
      
      if (fs.existsSync(demoDataPath)) {
        const demoData = fs.readFileSync(demoDataPath, 'utf8');
        
        // Run demo data as a transaction
        await db.exec('BEGIN TRANSACTION');
        await db.exec(demoData);
        await db.exec('COMMIT');
        
        console.log('Demo data created successfully');
      } else {
        console.log('Demo data file not found');
      }
    }
    
    await db.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
