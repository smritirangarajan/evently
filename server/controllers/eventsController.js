const axios = require('axios');

const keywordMap = {
    "chill": ["theater", "art", "classical music"],
    "party": ["concert", "music festival", "nightlife"],
    "sports": ["sports", "basketball", "soccer"],
    "family": ["family", "kids", "community"],
    "adventure": ["outdoor", "hiking", "festivals"],
    "foodie": ["food festival", "wine tasting", "culinary"]
  };

module.exports = {
  searchTicketmasterEvents: async (req, res) => {
    try {
      const { location, mood } = req.query;

      const moodKeywords = keywordMap[mood?.toLowerCase()] || ["music"];
      const keyword = moodKeywords[Math.floor(Math.random() * moodKeywords.length)];

      console.log(`Searching Ticketmaster for: ${keyword} in ${location}`);

      const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
        params: {
          apikey: process.env.TICKETMASTER_API_KEY,
          city: location,
          keyword: keyword
        }
      });

      const events = response.data._embedded?.events || [];
      if (events.length === 0) {
        return res.status(200).json({ message: "No events found for your search. Try a different mood!" });
      }
      res.json(events);

    } catch (error) {
      console.error('Error fetching Ticketmaster events:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch Ticketmaster events' });
    }
  },

  searchEventbriteEvents: async (req, res) => {
    try {
      const { location, keyword } = req.query;

      const response = await axios({
        method: 'GET',
        url: 'https://www.eventbriteapi.com/v3/events/search/',
        headers: {
          Authorization: `Bearer ${process.env.EVENTBRITE_API_KEY}`
        },
        params: {
          'location.address': location,
          'q': keyword
        }
      });

      const events = response.data.events || [];
      res.json(events);

    } catch (error) {
      console.error('Error fetching Eventbrite events:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch Eventbrite events' });
    }}
};
