
/**
 * User API endpoints
 * Handles CRUD operations for users
 */

const express = require('express');
const router = express.Router();
const { getDbConnection } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

// Get all users
router.get('/', async (req, res) => {
  try {
    const db = await getDbConnection();
    
    // Fetch users with their disabilities
    const users = await db.all(`
      SELECT 
        u.id, u.name, u.avatar, u.created_at, 
        d.language, d.planning, d.sensory, d.motor, d.social, d.cognitive,
        p.simplified_language, p.enhanced_visual_support, p.high_contrast, p.larger_text
      FROM users u
      LEFT JOIN user_disabilities d ON u.id = d.user_id
      LEFT JOIN user_preferences p ON u.id = p.user_id
      ORDER BY u.name
    `);
    
    // Format the response
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.created_at,
      disabilities: {
        language: Boolean(user.language),
        planning: Boolean(user.planning),
        sensory: Boolean(user.sensory),
        motor: Boolean(user.motor),
        social: Boolean(user.social),
        cognitive: Boolean(user.cognitive)
      },
      preferences: {
        simplifiedLanguage: Boolean(user.simplified_language),
        enhancedVisualSupport: Boolean(user.enhanced_visual_support),
        highContrast: Boolean(user.high_contrast),
        largerText: Boolean(user.larger_text)
      }
    }));
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDbConnection();
    
    // Fetch user with disabilities and preferences
    const user = await db.get(`
      SELECT 
        u.id, u.name, u.avatar, u.created_at, 
        d.language, d.planning, d.sensory, d.motor, d.social, d.cognitive,
        p.simplified_language, p.enhanced_visual_support, p.high_contrast, p.larger_text
      FROM users u
      LEFT JOIN user_disabilities d ON u.id = d.user_id
      LEFT JOIN user_preferences p ON u.id = p.user_id
      WHERE u.id = ?
    `, [id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Format the response
    const formattedUser = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.created_at,
      disabilities: {
        language: Boolean(user.language),
        planning: Boolean(user.planning),
        sensory: Boolean(user.sensory),
        motor: Boolean(user.motor),
        social: Boolean(user.social),
        cognitive: Boolean(user.cognitive)
      },
      preferences: {
        simplifiedLanguage: Boolean(user.simplified_language),
        enhancedVisualSupport: Boolean(user.enhanced_visual_support),
        highContrast: Boolean(user.high_contrast),
        largerText: Boolean(user.larger_text)
      }
    };
    
    res.json(formattedUser);
  } catch (error) {
    console.error(`Error fetching user ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { name, avatar, disabilities, preferences } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'User name is required' });
    }
    
    const db = await getDbConnection();
    
    // Generate UUID for the new user
    const userId = uuidv4();
    
    // Start a transaction
    await db.run('BEGIN TRANSACTION');
    
    // Insert user
    await db.run(
      'INSERT INTO users (id, name, avatar) VALUES (?, ?, ?)',
      [userId, name, avatar || null]
    );
    
    // Insert disabilities if provided
    if (disabilities) {
      await db.run(`
        INSERT INTO user_disabilities 
        (user_id, language, planning, sensory, motor, social, cognitive)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        disabilities.language || false,
        disabilities.planning || false,
        disabilities.sensory || false,
        disabilities.motor || false,
        disabilities.social || false,
        disabilities.cognitive || false
      ]);
    }
    
    // Insert preferences if provided
    if (preferences) {
      await db.run(`
        INSERT INTO user_preferences 
        (user_id, simplified_language, enhanced_visual_support, high_contrast, larger_text)
        VALUES (?, ?, ?, ?, ?)
      `, [
        userId,
        preferences.simplifiedLanguage || false,
        preferences.enhancedVisualSupport || false,
        preferences.highContrast || false,
        preferences.largerText || false
      ]);
    }
    
    // Commit the transaction
    await db.run('COMMIT');
    
    // Fetch the newly created user
    const user = await db.get(`
      SELECT 
        u.id, u.name, u.avatar, u.created_at, 
        d.language, d.planning, d.sensory, d.motor, d.social, d.cognitive,
        p.simplified_language, p.enhanced_visual_support, p.high_contrast, p.larger_text
      FROM users u
      LEFT JOIN user_disabilities d ON u.id = d.user_id
      LEFT JOIN user_preferences p ON u.id = p.user_id
      WHERE u.id = ?
    `, [userId]);
    
    // Format the response
    const formattedUser = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.created_at,
      disabilities: {
        language: Boolean(user.language),
        planning: Boolean(user.planning),
        sensory: Boolean(user.sensory),
        motor: Boolean(user.motor),
        social: Boolean(user.social),
        cognitive: Boolean(user.cognitive)
      },
      preferences: {
        simplifiedLanguage: Boolean(user.simplified_language),
        enhancedVisualSupport: Boolean(user.enhanced_visual_support),
        highContrast: Boolean(user.high_contrast),
        largerText: Boolean(user.larger_text)
      }
    };
    
    res.status(201).json(formattedUser);
  } catch (error) {
    // Rollback transaction on error
    const db = await getDbConnection();
    await db.run('ROLLBACK');
    
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, avatar, disabilities, preferences } = req.body;
    
    const db = await getDbConnection();
    
    // Check if user exists
    const existingUser = await db.get('SELECT id FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Start a transaction
    await db.run('BEGIN TRANSACTION');
    
    // Update user
    if (name || avatar !== undefined) {
      const updateFields = [];
      const updateParams = [];
      
      if (name) {
        updateFields.push('name = ?');
        updateParams.push(name);
      }
      
      if (avatar !== undefined) {
        updateFields.push('avatar = ?');
        updateParams.push(avatar);
      }
      
      if (updateFields.length > 0) {
        await db.run(
          `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
          [...updateParams, id]
        );
      }
    }
    
    // Update disabilities if provided
    if (disabilities) {
      // Check if disabilities record exists
      const existingDisabilities = await db.get(
        'SELECT id FROM user_disabilities WHERE user_id = ?', 
        [id]
      );
      
      if (existingDisabilities) {
        await db.run(`
          UPDATE user_disabilities
          SET language = ?, planning = ?, sensory = ?, motor = ?, social = ?, cognitive = ?
          WHERE user_id = ?
        `, [
          disabilities.language || false,
          disabilities.planning || false,
          disabilities.sensory || false,
          disabilities.motor || false,
          disabilities.social || false,
          disabilities.cognitive || false,
          id
        ]);
      } else {
        await db.run(`
          INSERT INTO user_disabilities 
          (user_id, language, planning, sensory, motor, social, cognitive)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
          disabilities.language || false,
          disabilities.planning || false,
          disabilities.sensory || false,
          disabilities.motor || false,
          disabilities.social || false,
          disabilities.cognitive || false
        ]);
      }
    }
    
    // Update preferences if provided
    if (preferences) {
      // Check if preferences record exists
      const existingPreferences = await db.get(
        'SELECT id FROM user_preferences WHERE user_id = ?', 
        [id]
      );
      
      if (existingPreferences) {
        await db.run(`
          UPDATE user_preferences
          SET simplified_language = ?, enhanced_visual_support = ?, high_contrast = ?, larger_text = ?
          WHERE user_id = ?
        `, [
          preferences.simplifiedLanguage || false,
          preferences.enhancedVisualSupport || false,
          preferences.highContrast || false,
          preferences.largerText || false,
          id
        ]);
      } else {
        await db.run(`
          INSERT INTO user_preferences 
          (user_id, simplified_language, enhanced_visual_support, high_contrast, larger_text)
          VALUES (?, ?, ?, ?, ?)
        `, [
          id,
          preferences.simplifiedLanguage || false,
          preferences.enhancedVisualSupport || false,
          preferences.highContrast || false,
          preferences.largerText || false
        ]);
      }
    }
    
    // Commit the transaction
    await db.run('COMMIT');
    
    // Fetch the updated user
    const user = await db.get(`
      SELECT 
        u.id, u.name, u.avatar, u.created_at, 
        d.language, d.planning, d.sensory, d.motor, d.social, d.cognitive,
        p.simplified_language, p.enhanced_visual_support, p.high_contrast, p.larger_text
      FROM users u
      LEFT JOIN user_disabilities d ON u.id = d.user_id
      LEFT JOIN user_preferences p ON u.id = p.user_id
      WHERE u.id = ?
    `, [id]);
    
    // Format the response
    const formattedUser = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.created_at,
      disabilities: {
        language: Boolean(user.language),
        planning: Boolean(user.planning),
        sensory: Boolean(user.sensory),
        motor: Boolean(user.motor),
        social: Boolean(user.social),
        cognitive: Boolean(user.cognitive)
      },
      preferences: {
        simplifiedLanguage: Boolean(user.simplified_language),
        enhancedVisualSupport: Boolean(user.enhanced_visual_support),
        highContrast: Boolean(user.high_contrast),
        largerText: Boolean(user.larger_text)
      }
    };
    
    res.json(formattedUser);
  } catch (error) {
    // Rollback transaction on error
    const db = await getDbConnection();
    await db.run('ROLLBACK');
    
    console.error(`Error updating user ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDbConnection();
    
    // Check if user exists
    const existingUser = await db.get('SELECT id FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Start a transaction
    await db.run('BEGIN TRANSACTION');
    
    // Delete user (cascade will delete related data due to foreign key constraints)
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    
    // Commit the transaction
    await db.run('COMMIT');
    
    res.status(204).end();
  } catch (error) {
    // Rollback transaction on error
    const db = await getDbConnection();
    await db.run('ROLLBACK');
    
    console.error(`Error deleting user ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
