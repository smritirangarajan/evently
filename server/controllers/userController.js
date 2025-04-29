// server/controllers/userController.js
const User = require('../models/User');

module.exports = {
  saveEvent: async (req, res) => {
    try {
      const { userId, event } = req.body;
      const user = await User.findById(userId);
      user.savedEvents.push(event);
      await user.save();
      res.status(200).json({ message: "Event saved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to save event" });
    }
  },

  getSavedEvents: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate('savedEvents');
      res.status(200).json(user.savedEvents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch saved events" });
    }
  },

  updateUserPreferences: async (req, res) => {
    try {
      const { userId, preferences } = req.body;
      const user = await User.findByIdAndUpdate(userId, { preferences }, { new: true });
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  }
};