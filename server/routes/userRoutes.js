const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Save event
router.post('/save', userController.saveEvent);

// Get saved events
router.get('/saved/:userId', userController.getSavedEvents);

// Update user preferences
router.post('/preferences', userController.updateUserPreferences);

module.exports = router;