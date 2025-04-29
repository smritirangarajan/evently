const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// Example route for Ticketmaster search
router.get('/ticketmaster', eventsController.searchTicketmasterEvents);

// Example route for Eventbrite search
router.get('/eventbrite', eventsController.searchEventbriteEvents);

module.exports = router;