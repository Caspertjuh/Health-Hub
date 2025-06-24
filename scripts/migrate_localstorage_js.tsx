
/**
 * Migration script to transfer data from localStorage to the new backend database
 * 
 * Run this script after setting up the backend database to import existing
 * localStorage data from a JSON file export.
 * 
 * Usage:
 * 1. Export localStorage data from browser to a JSON file
 * 2. node migrate-localstorage.js path/to/localstorage-export.json
 */

const fs = require('fs');
const path = require('path');
const { getDbConnection } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

async function migrateData(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found at ${filePath}`);
      process.exit(1);
    }

    // Read JSON file
    const rawData = fs.readFileSync(filePath, 'utf8');
    let localStorageData;
    
    try {
      localStorageData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error parsing JSON file:', error);
      process.exit(1);
    }

    console.log('Successfully read localStorage data');
    
    // Get database connection
    const db = await getDbConnection();
    
    // Start transaction
    await db.run('BEGIN TRANSACTION');
    
    try {
      // 1. Migrate users data
      await migrateUsers(db, localStorageData);
      
      // 2. Migrate activities data
      await migrateActivities(db, localStorageData);
      
      // Commit transaction
      await db.run('COMMIT');
      console.log('\nMigration completed successfully!');
    } catch (error) {
      // Rollback on error
      await db.run('ROLLBACK');
      console.error('Migration failed, transaction rolled back:', error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

async function migrateUsers(db, data) {
  const usersKey = 'day-app-users';
  const currentUserKey = 'day-app-current-user';
  
  if (!data[usersKey]) {
    console.log('No users data found in localStorage');
    return;
  }
  
  const users = JSON.parse(data[usersKey]);
  const currentUser = data[currentUserKey] ? JSON.parse(data[currentUserKey]) : null;
  
  console.log(`Found ${users.length} users to migrate`);
  
  for (const user of users) {
    // Generate a UUID if user doesn't have one
    const userId = user.id || `user-${uuidv4()}`;
    
    // Insert user
    await db.run(
      'INSERT OR IGNORE INTO users (id, name, avatar) VALUES (?, ?, ?)',
      [userId, user.name, user.avatar || null]
    );
    
    // Insert disabilities if any
    if (user.disabilities) {
      await db.run(`
        INSERT OR IGNORE INTO user_disabilities 
        (user_id, language, planning, sensory, motor, social, cognitive)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        user.disabilities.language || false,
        user.disabilities.planning || false,
        user.disabilities.sensory || false,
        user.disabilities.motor || false,
        user.disabilities.social || false,
        user.disabilities.cognitive || false
      ]);
    }
    
    // Insert preferences if any
    if (user.preferences) {
      await db.run(`
        INSERT OR IGNORE INTO user_preferences 
        (user_id, simplified_language, enhanced_visual_support, high_contrast, larger_text)
        VALUES (?, ?, ?, ?, ?)
      `, [
        userId,
        user.preferences.simplifiedLanguage || false,
        user.preferences.enhancedVisualSupport || false,
        user.preferences.highContrast || false,
        user.preferences.largerText || false
      ]);
    }
    
    console.log(`  - Migrated user: ${user.name} (${userId})`);
  }
  
  console.log(`Users migration completed`);
}

async function migrateActivities(db, data) {
  const activitiesKey = 'day-app-activities';
  
  if (!data[activitiesKey]) {
    console.log('No activities data found in localStorage');
    return;
  }
  
  const activities = JSON.parse(data[activitiesKey]);
  
  console.log(`Found ${activities.length} activities to migrate`);
  
  // First, gather unique templates
  const templates = new Map();
  
  for (const activity of activities) {
    const templateKey = `${activity.title}-${activity.type}`;
    
    if (!templates.has(templateKey)) {
      templates.set(templateKey, {
        id: `template-${uuidv4()}`,
        title: activity.title,
        description: activity.description || null,
        category: activity.category,
        type: activity.type,
        icon: activity.icon,
        color: activity.color,
        location: activity.location || null,
        difficulty: activity.difficulty || 'easy',
        requiredSupport: activity.requiredSupport || {}
      });
    }
  }
  
  console.log(`Identified ${templates.size} unique activity templates`);
  
  // Insert templates
  for (const [key, template] of templates.entries()) {
    // Insert template
    await db.run(`
      INSERT OR IGNORE INTO activity_templates 
      (id, title, description, category, type, icon, color, location, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      template.id,
      template.title,
      template.description,
      template.category,
      template.type,
      template.icon,
      template.color,
      template.location,
      template.difficulty
    ]);
    
    // Insert required support for template
    if (template.requiredSupport) {
      await db.run(`
        INSERT OR IGNORE INTO template_required_support 
        (template_id, language, planning, sensory, motor, social, cognitive)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        template.id,
        template.requiredSupport.language || false,
        template.requiredSupport.planning || false,
        template.requiredSupport.sensory || false,
        template.requiredSupport.motor || false,
        template.requiredSupport.social || false,
        template.requiredSupport.cognitive || false
      ]);
    }
    
    console.log(`  - Migrated template: ${template.title} (${template.id})`);
  }
  
  // Insert activities
  for (const activity of activities) {
    const templateKey = `${activity.title}-${activity.type}`;
    const template = templates.get(templateKey);
    
    if (!template) {
      console.warn(`  - Warning: No template found for activity: ${activity.title}`);
      continue;
    }
    
    const activityId = activity.id || `activity-${uuidv4()}`;
    
    // Insert activity
    await db.run(`
      INSERT OR IGNORE INTO activities 
      (id, template_id, user_id, title, description, start_time, end_time, date, location, 
       category, type, icon, color, completed, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      activityId,
      template.id,
      activity.userId || null,
      activity.title,
      activity.description || null,
      activity.startTime || null,
      activity.endTime || null,
      activity.date || null,
      activity.location || null,
      activity.category,
      activity.type,
      activity.icon,
      activity.color,
      activity.completed || false,
      activity.difficulty || 'easy'
    ]);
    
    // Insert required support for activity
    if (activity.requiredSupport) {
      await db.run(`
        INSERT OR IGNORE INTO activity_required_support 
        (activity_id, language, planning, sensory, motor, social, cognitive)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        activityId,
        activity.requiredSupport.language || false,
        activity.requiredSupport.planning || false,
        activity.requiredSupport.sensory || false,
        activity.requiredSupport.motor || false,
        activity.requiredSupport.social || false,
        activity.requiredSupport.cognitive || false
      ]);
    }
    
    // If it's a group activity, handle participants and settings
    if (activity.category === 'group' && activity.participants) {
      // Insert group activity settings
      await db.run(`
        INSERT OR IGNORE INTO group_activity_settings (activity_id, max_participants)
        VALUES (?, ?)
      `, [activityId, activity.maxParticipants || 8]);
      
      // Insert participants
      for (const participantId of activity.participants) {
        await db.run(`
          INSERT OR IGNORE INTO group_activity_participants (activity_id, user_id)
          VALUES (?, ?)
        `, [activityId, participantId]);
      }
    }
  }
  
  console.log(`Activities migration completed`);
}

// Main execution
if (process.argv.length < 3) {
  console.error('Usage: node migrate-localstorage.js <path-to-json-file>');
  process.exit(1);
}

const filePath = path.resolve(process.argv[2]);
migrateData(filePath);
