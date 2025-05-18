const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/ticketmaster', async (req, res) => {
    const { mood, location, keyword } = req.query;
  
    try {
      const apiKey = process.env.TICKETMASTER_API_KEY;
      
      // Simplify the params to match your working URL structure
      const params = {
        apikey: apiKey,
        keyword: keyword || 'concerts', // Use 'concerts' as default keyword
        city: location || 'San Francisco'
      };
      
  
      const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', { params });
      
      // Log the response structure to understand what we're getting back
      
      // If we have events, send them back
      if (response.data._embedded && response.data._embedded.events) {
        return res.json(response.data._embedded.events);
      }
      
      // If we don't have events, send an empty array
      return res.json([]);
    } catch (err) {
      console.error('Ticketmaster API error:', err.message);
      // Add more detailed error logging
      if (err.response) {
        console.error('Error status:', err.response.status);
        console.error('Error data:', err.response.data);
      }
      res.status(500).json({ 
        error: 'Failed to fetch events from Ticketmaster',
        message: err.message
      });
    }
  });

module.exports = router;