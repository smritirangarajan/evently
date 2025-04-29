const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User signup
router.post('/signup', authController.signup);

// User login
router.post('/login', authController.login);

module.exports = router;