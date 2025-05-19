const axios = require('axios');
const Fuse = require('fuse.js');

// Expanded keyword map for richer fuzzy matching
const keywordMap = {
  concerts: ["concert", "music", "live", "gig", "orchestra", "performance", "headliner"],
  theater: ["theater", "musical", "broadway", "stage", "play", "drama"],
  comedy: ["comedy", "stand up", "humor", "laugh", "sketch", "improv"],
  film: ["movie", "film screening", "cinema", "indie film", "documentary", "short film"],
  "art exhibits": ["art", "gallery", "exhibit", "installation", "sculpture", "modern art"],
  dance: ["dance", "ballet", "performance", "hip hop", "salsa", "jazz dance"],
  chill: ["theater", "art", "classical music", "instrumental", "ambient", "acoustic"],
  party: ["concert", "festival", "nightlife", "DJ", "rave", "club", "afterparty"],
  sports: ["sports", "basketball", "soccer", "baseball", "football", "tennis", "mma", "racing"],
  family: ["family", "kids", "children", "community", "pets", "storybook", "puppet show"],
  adventure: ["outdoor", "hiking", "festivals", "exploration", "camping", "climbing", "kayaking"],
  foodie: ["food", "wine", "culinary", "tasting", "cooking", "gourmet", "baking", "farmers market"],
  fitness: ["fitness", "yoga", "workout", "pilates", "gym", "crossfit", "bootcamp", "meditation", "spin"],
  literature: ["books", "book club", "reading", "poetry", "author talk", "storytelling", "literary"],
  tech: ["technology", "startups", "coding", "AI", "blockchain", "web3", "product management", "hackathon", "data science"],
  science: ["science", "astronomy", "biology", "physics", "engineering", "space", "lab tour"],
  environment: ["environment", "climate", "sustainability", "ecology", "wildlife", "green energy"]
};

const allKeywords = Object.values(keywordMap).flat();
const fuse = new Fuse(allKeywords, { threshold: 0.45 });

module.exports = {
  searchTicketmasterEvents: async (req, res) => {
    try {
      const { location, mood, city, keyword } = req.query;
      const resolvedLocation = location || city;

      let resolvedKeyword = keyword;

      if (!resolvedKeyword && mood) {
        const moodKeywords = keywordMap[mood.toLowerCase()] || ["music"];
        resolvedKeyword = moodKeywords[Math.floor(Math.random() * moodKeywords.length)];
      }

      if (!resolvedLocation || !resolvedKeyword) {
        return res.status(400).json({ error: "Missing city/location or keyword/mood." });
      }

      const fuzzyMatch = fuse.search(resolvedKeyword);
      const bestKeyword = fuzzyMatch.length > 0 ? fuzzyMatch[0].item : resolvedKeyword;


      const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
        params: {
          apikey: process.env.TICKETMASTER_API_KEY,
          city: resolvedLocation,
          keyword: bestKeyword
        }
      });

      let events = response.data._embedded?.events || [];

      // Try the next closest fuzzy match if no results were found
      if (events.length === 0 && fuzzyMatch.length > 1) {
        const nextBestKeyword = fuzzyMatch[1].item;

        const retryResponse = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
          params: {
            apikey: process.env.TICKETMASTER_API_KEY,
            city: resolvedLocation,
            keyword: nextBestKeyword
          }
        });

        events = retryResponse.data._embedded?.events || [];

        if (events.length > 0) {
          return res.json({ message: `No results for "${bestKeyword}". Showing results for "${nextBestKeyword}" instead.`, events });
        }
      }

      if (events.length === 0) {
        return res.status(200).json({ message: `No events found for "${resolvedKeyword}". Try another search.` });
      }

      res.json(events);
    } catch (error) {
      console.error('❌ Error fetching Ticketmaster events:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch Ticketmaster events' });
    }
  }
};
