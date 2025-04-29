const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// Search for events
router.get('/search', eventsController.searchEvents);

module.exports = router;