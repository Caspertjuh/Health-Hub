
/**
 * Activities API endpoints
 * Handles CRUD operations for activities and activity templates
 */

const express = require('express');
const router = express.Router();
const { getDbConnection } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

// Get all activities for a specific user and date
router.get('/user/:userId/date/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const db = await getDbConnection();
    
    // Get all activities for this user and date
    const activities = await db.all(`
      SELECT 
        a.id, a.template_id, a.user_id, a.title, a.description, 
        a.start_time, a.end_time, a.date, a.location, 
        a.category, a.type, a.icon, a.color, a.completed, a.difficulty,
        ars.language, ars.planning, ars.sensory, ars.motor, ars.social, ars.cognitive,
        gas.max_participants
      FROM activities a
      LEFT JOIN activity_required_support ars ON a.id = ars.activity_id
      LEFT JOIN group_activity_settings gas ON a.id = gas.activity_id
      WHERE (a.user_id = ? OR a.category = 'group') AND a.date = ?
      ORDER BY a.start_time
    `, [userId, date]);
    
    // Get group activity participants
    const groupActivities = activities.filter(a => a.category === 'group').map(a => a.id);
    let participants = [];
    
    if (groupActivities.length > 0) {
      participants = await db.all(`
        SELECT gap.activity_id, gap.user_id, u.name
        FROM group_activity_participants gap
        JOIN users u ON gap.user_id = u.id
        WHERE gap.activity_id IN (${groupActivities.map(() => '?').join(',')})
      `, groupActivities);
    }
    
    // Format the response
    const formattedActivities = activities.map(activity => {
      const formattedActivity = {
        id: activity.id,
        templateId: activity.template_id,
        userId: activity.user_id,
        title: activity.title,
        description: activity.description,
        startTime: activity.start_time,
        endTime: activity.end_time,
        date: activity.date,
        location: activity.location,
        category: activity.category,
        type: activity.type,
        icon: activity.icon,
        color: activity.color,
        completed: Boolean(activity.completed),
        difficulty: activity.difficulty,
        requiredSupport: {
          language: Boolean(activity.language),
          planning: Boolean(activity.planning),
          sensory: Boolean(activity.sensory),
          motor: Boolean(activity.motor),
          social: Boolean(activity.social),
          cognitive: Boolean(activity.cognitive)
        }
      };
      
      // Add group activity specific data
      if (activity.category === 'group') {
        formattedActivity.maxParticipants = activity.max_participants;
        formattedActivity.participants = participants
          .filter(p => p.activity_id === activity.id)
          .map(p => ({ id: p.user_id, name: p.name }));
      }
      
      return formattedActivity;
    });
    
    res.json(formattedActivities);
  } catch (error) {
    console.error(`Error fetching activities for user ${req.params.userId} on ${req.params.date}:`, error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get all activity templates
router.get('/templates', async (req, res) => {
  try {
    const db = await getDbConnection();
    
    // Get all templates with their required support
    const templates = await db.all(`
      SELECT 
        t.id, t.title, t.description, t.category, t.type, 
        t.icon, t.color, t.location, t.difficulty, t.created_at, t.updated_at,
        trs.language, trs.planning, trs.sensory, trs.motor, trs.social, trs.cognitive
      FROM activity_templates t
      LEFT JOIN template_required_support trs ON t.id = trs.template_id
      ORDER BY t.type, t.title
    `);
    
    // Format the response
    const formattedTemplates = templates.map(template => ({
      id: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      type: template.type,
      icon: template.icon,
      color: template.color,
      location: template.location,
      difficulty: template.difficulty,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
      requiredSupport: {
        language: Boolean(template.language),
        planning: Boolean(template.planning),
        sensory: Boolean(template.sensory),
        motor: Boolean(template.motor),
        social: Boolean(template.social),
        cognitive: Boolean(template.cognitive)
      }
    }));
    
    res.json(formattedTemplates);
  } catch (error) {
    console.error('Error fetching activity templates:', error);
    res.status(500).json({ error: 'Failed to fetch activity templates' });
  }
});

// Get a specific activity template
router.get('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDbConnection();
    
    // Get the template with its required support
    const template = await db.get(`
      SELECT 
        t.id, t.title, t.description, t.category, t.type, 
        t.icon, t.color, t.location, t.difficulty, t.created_at, t.updated_at,
        trs.language, trs.planning, trs.sensory, trs.motor, trs.social, trs.cognitive
      FROM activity_templates t
      LEFT JOIN template_required_support trs ON t.id = trs.template_id
      WHERE t.id = ?
    `, [id]);
    
    if (!template) {
      return res.status(404).json({ error: 'Activity template not found' });
    }
    
    // Format the response
    const formattedTemplate = {
      id: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      type: template.type,
      icon: template.icon,
      color: template.color,
      location: template.location,
      difficulty: template.difficulty,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
      requiredSupport: {
        language: Boolean(template.language),
        planning: Boolean(template.planning),
        sensory: Boolean(template.sensory),
        motor: Boolean(template.motor),
        social: Boolean(template.social),
        cognitive: Boolean(template.cognitive)
      }
    };
    
    res.json(formattedTemplate);
  } catch (error) {
    console.error(`Error fetching activity template ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch activity template' });
  }
});

// Create a new activity template
router.post('/templates', async (req, res) => {
  try {
    const { 
      title, description, category, type, icon, color, 
      location, difficulty, requiredSupport 
    } = req.body;
    
    // Validate required fields
    if (!title || !category || !type || !icon || !color) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, category, type, icon, and color are required' 
      });
    }
    
    // Validate category and type
    const validCategories = ['fixed', 'flexible', 'group'];
    const validTypes = ['hygiene', 'meal', 'medication', 'therapy', 'exercise', 
                        'social', 'entertainment', 'creative', 'education', 'other'];
    const validDifficulties = ['easy', 'medium', 'hard'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
      });
    }
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    if (difficulty && !validDifficulties.includes(difficulty)) {
      return res.status(400).json({ 
        error: `Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}` 
      });
    }
    
    const db = await getDbConnection();
    
    // Generate UUID for the new template
    const templateId = `template-${uuidv4()}`;
    
    // Start a transaction
    await db.run('BEGIN TRANSACTION');
    
    // Insert template
    await db.run(`
      INSERT INTO activity_templates 
      (id, title, description, category, type, icon, color, location, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      templateId, 
      title, 
      description || null, 
      category, 
      type, 
      icon, 
      color, 
      location || null, 
      difficulty || null
    ]);
    
    // Insert required support if provided
    if (requiredSupport) {
      await db.run(`
        INSERT INTO template_required_support 
        (template_id, language, planning, sensory, motor, social, cognitive)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        templateId,
        requiredSupport.language || false,
        requiredSupport.planning || false,
        requiredSupport.sensory || false,
        requiredSupport.motor || false,
        requiredSupport.social || false,
        requiredSupport.cognitive || false
      ]);
    }
    
    // Commit the transaction
    await db.run('COMMIT');
    
    // Fetch the newly created template
    const template = await db.get(`
      SELECT 
        t.id, t.title, t.description, t.category, t.type, 
        t.icon, t.color, t.location, t.difficulty, t.created_at, t.updated_at,
        trs.language, trs.planning, trs.sensory, trs.motor, trs.social, trs.cognitive
      FROM activity_templates t
      LEFT JOIN template_required_support trs ON t.id = trs.template_id
      WHERE t.id = ?
    `, [templateId]);
    
    // Format the response
    const formattedTemplate = {
      id: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      type: template.type,
      icon: template.icon,
      color: template.color,
      location: template.location,
      difficulty: template.difficulty,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
      requiredSupport: {
        language: Boolean(template.language),
        planning: Boolean(template.planning),
        sensory: Boolean(template.sensory),
        motor: Boolean(template.motor),
        social: Boolean(template.social),
        cognitive: Boolean(template.cognitive)
      }
    };
    
    res.status(201).json(formattedTemplate);
  } catch (error) {
    // Rollback transaction on error
    const db = await getDbConnection();
    await db.run('ROLLBACK');
    
    console.error('Error creating activity template:', error);
    res.status(500).json({ error: 'Failed to create activity template' });
  }
});

// Update an activity template
router.put('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, description, category, type, icon, color, 
      location, difficulty, requiredSupport 
    } = req.body;
    
    const db = await getDbConnection();
    
    // Check if template exists
    const existingTemplate = await db.get('SELECT id FROM activity_templates WHERE id = ?', [id]);
    if (!existingTemplate) {
      return res.status(404).json({ error: 'Activity template not found' });
    }
    
    // Validate category and type if provided
    const validCategories = ['fixed', 'flexible', 'group'];
    const validTypes = ['hygiene', 'meal', 'medication', 'therapy', 'exercise', 
                        'social', 'entertainment', 'creative', 'education', 'other'];
    const validDifficulties = ['easy', 'medium', 'hard'];
    
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ 
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
      });
    }
    
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    if (difficulty && !validDifficulties.includes(difficulty)) {
      return res.status(400).json({ 
        error: `Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}` 
      });
    }
    
    // Start a transaction
    await db.run('BEGIN TRANSACTION');
    
    // Update template
    const updateFields = [];
    const updateParams = [];
    
    if (title) {
      updateFields.push('title = ?');
      updateParams.push(title);
    }
    
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateParams.push(description);
    }
    
    if (category) {
      updateFields.push('category = ?');
      updateParams.push(category);
    }
    
    if (type) {
      updateFields.push('type = ?');
      updateParams.push(type);
    }
    
    if (icon) {
      updateFields.push('icon = ?');
      updateParams.push(icon);
    }
    
    if (color) {
      updateFields.push('color = ?');
      updateParams.push(color);
    }
    
    if (location !== undefined) {
      updateFields.push('location = ?');
      updateParams.push(location);
    }
    
    if (difficulty !== undefined) {
      updateFields.push('difficulty = ?');
      updateParams.push(difficulty);
    }
    
    if (updateFields.length > 0) {
      await db.run(
        `UPDATE activity_templates SET ${updateFields.join(', ')} WHERE id = ?`,
        [...updateParams, id]
      );
    }
    
    // Update required support if provided
    if (requiredSupport) {
      // Check if required support record exists
      const existingSupport = await db.get(
        'SELECT template_id FROM template_required_support WHERE template_id = ?', 
        [id]
      );
      
      if (existingSupport) {
        await db.run(`
          UPDATE template_required_support
          SET language = ?, planning = ?, sensory = ?, motor = ?, social = ?, cognitive = ?
          WHERE template_id = ?
        `, [
          requiredSupport.language || false,
          requiredSupport.planning || false,
          requiredSupport.sensory || false,
          requiredSupport.motor || false,
          requiredSupport.social || false,
          requiredSupport.cognitive || false,
          id
        ]);
      } else {
        await db.run(`
          INSERT INTO template_required_support 
          (template_id, language, planning, sensory, motor, social, cognitive)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
          requiredSupport.language || false,
          requiredSupport.planning || false,
          requiredSupport.sensory || false,
          requiredSupport.motor || false,
          requiredSupport.social || false,
          requiredSupport.cognitive || false
        ]);
      }
    }
    
    // Update all activities based on this template
    if (updateFields.length > 0) {
      await db.run(
        `UPDATE activities SET ${updateFields.join(', ')} WHERE template_id = ?`,
        [...updateParams, id]
      );
    }
    
    // Commit the transaction
    await db.run('COMMIT');
    
    // Fetch the updated template
    const template = await db.get(`
      SELECT 
        t.id, t.title, t.description, t.category, t.type, 
        t.icon, t.color, t.location, t.difficulty, t.created_at, t.updated_at,
        trs.language, trs.planning, trs.sensory, trs.motor, trs.social, trs.cognitive
      FROM activity_templates t
      LEFT JOIN template_required_support trs ON t.id = trs.template_id
      WHERE t.id = ?
    `, [id]);
    
    // Format the response
    const formattedTemplate = {
      id: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      type: template.type,
      icon: template.icon,
      color: template.color,
      location: template.location,
      difficulty: template.difficulty,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
      requiredSupport: {
        language: Boolean(template.language),
        planning: Boolean(template.planning),
        sensory: Boolean(template.sensory),
        motor: Boolean(template.motor),
        social: Boolean(template.social),
        cognitive: Boolean(template.cognitive)
      }
    };
    
    res.json(formattedTemplate);
  } catch (error) {
    // Rollback transaction on error
    const db = await getDbConnection();
    await db.run('ROLLBACK');
    
    console.error(`Error updating activity template ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update activity template' });
  }
});

// Create an activity from a template
router.post('/from-template/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    const { 
      userId, startTime, endTime, date, location, completed 
    } = req.body;
    
    // Validate required fields
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    const db = await getDbConnection();
    
    // Check if template exists
    const template = await db.get(`
      SELECT 
        t.id, t.title, t.description, t.category, t.type, 
        t.icon, t.color, t.location, t.difficulty,
        trs.language, trs.planning, trs.sensory, trs.motor, trs.social, trs.cognitive
      FROM activity_templates t
      LEFT JOIN template_required_support trs ON t.id = trs.template_id
      WHERE t.id = ?
    `, [templateId]);
    
    if (!template) {
      return res.status(404).json({ error: 'Activity template not found' });
    }
    
    // Generate UUID for the new activity
    const activityId = `activity-${uuidv4()}`;
    
    // Start a transaction
    await db.run('BEGIN TRANSACTION');
    
    // Insert activity
    await db.run(`
      INSERT INTO activities 
      (id, template_id, user_id, title, description, start_time, end_time, date, location, 
       category, type, icon, color, completed, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      activityId,
      templateId,
      userId || null,
      template.title,
      template.description,
      startTime || null,
      endTime || null,
      date,
      location || template.location,
      template.category,
      template.type,
      template.icon,
      template.color,
      completed || false,
      template.difficulty
    ]);
    
    // Insert required support from template
    await db.run(`
      INSERT INTO activity_required_support 
      (activity_id, language, planning, sensory, motor, social, cognitive)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      activityId,
      template.language || false,
      template.planning || false,
      template.sensory || false,
      template.motor || false,
      template.social || false,
      template.cognitive || false
    ]);
    
    // If it's a group activity, set up group settings
    if (template.category === 'group') {
      // Default max participants
      const maxParticipants = 8;
      
      await db.run(`
        INSERT INTO group_activity_settings (activity_id, max_participants)
        VALUES (?, ?)
      `, [activityId, maxParticipants]);
    }
    
    // Commit the transaction
    await db.run('COMMIT');
    
    // Fetch the newly created activity
    const activity = await db.get(`
      SELECT 
        a.id, a.template_id, a.user_id, a.title, a.description, 
        a.start_time, a.end_time, a.date, a.location, 
        a.category, a.type, a.icon, a.color, a.completed, a.difficulty,
        ars.language, ars.planning, ars.sensory, ars.motor, ars.social, ars.cognitive,
        gas.max_participants
      FROM activities a
      LEFT JOIN activity_required_support ars ON a.id = ars.activity_id
      LEFT JOIN group_activity_settings gas ON a.id = gas.activity_id
      WHERE a.id = ?
    `, [activityId]);
    
    // Format the response
    const formattedActivity = {
      id: activity.id,
      templateId: activity.template_id,
      userId: activity.user_id,
      title: activity.title,
      description: activity.description,
      startTime: activity.start_time,
      endTime: activity.end_time,
      date: activity.date,
      location: activity.location,
      category: activity.category,
      type: activity.type,
      icon: activity.icon,
      color: activity.color,
      completed: Boolean(activity.completed),
      difficulty: activity.difficulty,
      requiredSupport: {
        language: Boolean(activity.language),
        planning: Boolean(activity.planning),
        sensory: Boolean(activity.sensory),
        motor: Boolean(activity.motor),
        social: Boolean(activity.social),
        cognitive: Boolean(activity.cognitive)
      }
    };
    
    // Add group activity specific data
    if (activity.category === 'group') {
      formattedActivity.maxParticipants = activity.max_participants;
      formattedActivity.participants = [];
    }
    
    res.status(201).json(formattedActivity);
  } catch (error) {
    // Rollback transaction on error
    const db = await getDbConnection();
    await db.run('ROLLBACK');
    
    console.error(`Error creating activity from template ${req.params.templateId}:`, error);
    res.status(500).json({ error: 'Failed to create activity from template' });
  }
});

// Update an activity's completion status
router.patch('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    if (completed === undefined) {
      return res.status(400).json({ error: 'Completed status is required' });
    }
    
    const db = await getDbConnection();
    
    // Check if activity exists
    const existingActivity = await db.get('SELECT id, user_id FROM activities WHERE id = ?', [id]);
    if (!existingActivity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    // Update activity completion status
    await db.run(
      'UPDATE activities SET completed = ? WHERE id = ?',
      [completed, id]
    );
    
    // Add to activity history if completed
    if (completed && existingActivity.user_id) {
      const activity = await db.get('SELECT date FROM activities WHERE id = ?', [id]);
      
      await db.run(`
        INSERT OR REPLACE INTO activity_history 
        (activity_id, user_id, date, completed, completion_time)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [id, existingActivity.user_id, activity.date, true]);
    }
    
    res.json({ id, completed });
  } catch (error) {
    console.error(`Error updating activity completion status ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update activity completion status' });
  }
});

// Join a group activity
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const db = await getDbConnection();
    
    // Check if activity exists and is a group activity
    const activity = await db.get(`
      SELECT a.id, a.category, gas.max_participants 
      FROM activities a
      LEFT JOIN group_activity_settings gas ON a.id = gas.activity_id
      WHERE a.id = ?
    `, [id]);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    if (activity.category !== 'group') {
      return res.status(400).json({ error: 'This is not a group activity' });
    }
    
    // Check if user is already a participant
    const existingParticipant = await db.get(
      'SELECT id FROM group_activity_participants WHERE activity_id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (existingParticipant) {
      return res.status(400).json({ error: 'User is already a participant in this activity' });
    }
    
    // Check if maximum participants is reached
    const currentParticipantsCount = await db.get(
      'SELECT COUNT(*) as count FROM group_activity_participants WHERE activity_id = ?',
      [id]
    );
    
    if (activity.max_participants && currentParticipantsCount.count >= activity.max_participants) {
      return res.status(400).json({ error: 'Maximum participants limit reached' });
    }
    
    // Add user to participants
    await db.run(
      'INSERT INTO group_activity_participants (activity_id, user_id) VALUES (?, ?)',
      [id, userId]
    );
    
    // Get updated participants list
    const participants = await db.all(`
      SELECT gap.user_id, u.name
      FROM group_activity_participants gap
      JOIN users u ON gap.user_id = u.id
      WHERE gap.activity_id = ?
    `, [id]);
    
    res.json({
      activityId: id,
      participants: participants.map(p => ({ id: p.user_id, name: p.name }))
    });
  } catch (error) {
    console.error(`Error joining group activity ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to join group activity' });
  }
});

// Leave a group activity
router.post('/:id/leave', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const db = await getDbConnection();
    
    // Check if activity exists and is a group activity
    const activity = await db.get(
      'SELECT id, category FROM activities WHERE id = ?', 
      [id]
    );
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    if (activity.category !== 'group') {
      return res.status(400).json({ error: 'This is not a group activity' });
    }
    
    // Remove user from participants
    await db.run(
      'DELETE FROM group_activity_participants WHERE activity_id = ? AND user_id = ?',
      [id, userId]
    );
    
    // Get updated participants list
    const participants = await db.all(`
      SELECT gap.user_id, u.name
      FROM group_activity_participants gap
      JOIN users u ON gap.user_id = u.id
      WHERE gap.activity_id = ?
    `, [id]);
    
    res.json({
      activityId: id,
      participants: participants.map(p => ({ id: p.user_id, name: p.name }))
    });
  } catch (error) {
    console.error(`Error leaving group activity ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to leave group activity' });
  }
});

// Generate activities for a user based on their disabilities
router.post('/generate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.body;
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    const db = await getDbConnection();
    
    // Check if user exists
    const user = await db.get(`
      SELECT 
        u.id, 
        d.language, d.planning, d.sensory, d.motor, d.social, d.cognitive
      FROM users u
      LEFT JOIN user_disabilities d ON u.id = d.user_id
      WHERE u.id = ?
    `, [userId]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Start a transaction
    await db.run('BEGIN TRANSACTION');
    
    // Check if there are already activities for this user and date
    const existingActivities = await db.get(
      'SELECT COUNT(*) as count FROM activities WHERE user_id = ? AND date = ?',
      [userId, date]
    );
    
    if (existingActivities.count > 0) {
      // Clear existing activities
      await db.run(
        'DELETE FROM activities WHERE user_id = ? AND date = ?',
        [userId, date]
      );
    }
    
    // Generate fixed activities from templates
    const fixedTemplates = await db.all(`
      SELECT 
        t.id, t.title, t.description, t.category, t.type, 
        t.icon, t.color, t.location, t.difficulty,
        trs.language, trs.planning, trs.sensory, trs.motor, trs.social, trs.cognitive
      FROM activity_templates t
      LEFT JOIN template_required_support trs ON t.id = trs.template_id
      WHERE t.category = 'fixed'
    `);
    
    const fixedActivities = [];
    for (const template of fixedTemplates) {
      // Standard times for fixed activities
      let startTime, endTime;
      if (template.title.includes('Ontbijt')) {
        startTime = '08:00';
        endTime = '09:00';
      } else if (template.title.includes('Medicatie')) {
        startTime = '09:15';
        endTime = '09:30';
      } else if (template.title.includes('Lunch')) {
        startTime = '12:30';
        endTime = '13:30';
      } else if (template.title.includes('Avondeten')) {
        startTime = '18:00';
        endTime = '19:00';
      }
      
      const activityId = `activity-${template.id}-${userId}-${date}`;
      
      // Insert fixed activity
      await db.run(`
        INSERT INTO activities 
        (id, template_id, user_id, title, description, start_time, end_time, date, location, 
         category, type, icon, color, completed, difficulty)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        activityId,
        template.id,
        userId,
        template.title,
        template.description,
        startTime,
        endTime,
        date,
        template.location,
        template.category,
        template.type,
        template.icon,
        template.color,
        false,
        template.difficulty
      ]);
      
      // Insert required support
      await db.run(`
        INSERT INTO activity_required_support 
        (activity_id, language, planning, sensory, motor, social, cognitive)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        activityId,
        template.language || false,
        template.planning || false,
        template.sensory || false,
        template.motor || false,
        template.social || false,
        template.cognitive || false
      ]);
      
      fixedActivities.push(activityId);
    }
    
    // Generate flexible activities based on user disabilities
    const flexibleTemplates = await db.all(`
      SELECT 
        t.id, t.title, t.description, t.category, t.type, 
        t.icon, t.color, t.location, t.difficulty,
        trs.language, trs.planning, trs.sensory, trs.motor, trs.social, trs.cognitive
      FROM activity_templates t
      LEFT JOIN template_required_support trs ON t.id = trs.template_id
      WHERE t.category = 'flexible'
    `);
    
    // Filter templates based on user disabilities
    const suitableTemplates = flexibleTemplates.filter(template => {
      // If user has a disability and activity requires support for it, exclude
      if (user.language && template.language) return false;
      if (user.planning && template.planning) return false;
      if (user.sensory && template.sensory) return false;
      if (user.motor && template.motor) return false;
      if (user.social && template.social) return false;
      if (user.cognitive && template.cognitive) return false;
      
      return true;
    });
    
    // Shuffle and pick a subset of flexible activities
    const shuffled = [...suitableTemplates].sort(() => 0.5 - Math.random());
    const selectedTemplates = shuffled.slice(0, 3); // Pick 3 random activities
    
    // Time slots for flexible activities
    const timeSlots = [
      { startTime: '10:00', endTime: '11:00' }, // Morning
      { startTime: '14:00', endTime: '15:00' }, // Afternoon
      { startTime: '16:00', endTime: '17:00' }  // Late afternoon
    ];
    
    const flexibleActivities = [];
    for (let i = 0; i < selectedTemplates.length; i++) {
      const template = selectedTemplates[i];
      const timeSlot = timeSlots[i];
      
      const activityId = `activity-${template.id}-${userId}-${date}`;
      
      // Insert flexible activity
      await db.run(`
        INSERT INTO activities 
        (id, template_id, user_id, title, description, start_time, end_time, date, location, 
         category, type, icon, color, completed, difficulty)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        activityId,
        template.id,
        userId,
        template.title,
        template.description,
        timeSlot.startTime,
        timeSlot.endTime,
        date,
        template.location,
        template.category,
        template.type,
        template.icon,
        template.color,
        false,
        template.difficulty
      ]);
      
      // Insert required support
      await db.run(`
        INSERT INTO activity_required_support 
        (activity_id, language, planning, sensory, motor, social, cognitive)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        activityId,
        template.language || false,
        template.planning || false,
        template.sensory || false,
        template.motor || false,
        template.social || false,
        template.cognitive || false
      ]);
      
      flexibleActivities.push(activityId);
    }
    
    // Commit the transaction
    await db.run('COMMIT');
    
    // Fetch all generated activities
    const activities = await db.all(`
      SELECT 
        a.id, a.template_id, a.user_id, a.title, a.description, 
        a.start_time, a.end_time, a.date, a.location, 
        a.category, a.type, a.icon, a.color, a.completed, a.difficulty,
        ars.language, ars.planning, ars.sensory, ars.motor, ars.social, ars.cognitive
      FROM activities a
      LEFT JOIN activity_required_support ars ON a.id = ars.activity_id
      WHERE a.user_id = ? AND a.date = ?
      ORDER BY a.start_time
    `, [userId, date]);
    
    // Format the response
    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      templateId: activity.template_id,
      userId: activity.user_id,
      title: activity.title,
      description: activity.description,
      startTime: activity.start_time,
      endTime: activity.end_time,
      date: activity.date,
      location: activity.location,
      category: activity.category,
      type: activity.type,
      icon: activity.icon,
      color: activity.color,
      completed: Boolean(activity.completed),
      difficulty: activity.difficulty,
      requiredSupport: {
        language: Boolean(activity.language),
        planning: Boolean(activity.planning),
        sensory: Boolean(activity.sensory),
        motor: Boolean(activity.motor),
        social: Boolean(activity.social),
        cognitive: Boolean(activity.cognitive)
      }
    }));
    
    res.json(formattedActivities);
  } catch (error) {
    // Rollback transaction on error
    const db = await getDbConnection();
    await db.run('ROLLBACK');
    
    console.error(`Error generating activities for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to generate activities' });
  }
});

module.exports = router;
