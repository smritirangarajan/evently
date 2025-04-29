const axios = require('axios');

module.exports = {
  checkWeather: async (req, res) => {
    try {
      const { city } = req.query;

      const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'imperial'  
        }
      });

      // Pick the weather for the next day
      const nextDayForecast = response.data.list[0];
      const weatherDescription = nextDayForecast.weather[0].description;
      const temp = nextDayForecast.main.temp;

      // Define "good" weather
      const goodWeather = temp >= 60 && temp <= 85 && !weatherDescription.includes('rain');

      res.json({ goodWeather, temp, weatherDescription });

    } catch (error) {
      console.error('Error fetching weather:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch weather' });
    }
  }
};
