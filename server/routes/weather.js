const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/check', weatherController.checkWeather);

module.exports = router;
