// controllers/activityController.js
const Activity = require('../models/Activity');
const asyncHandler = require('express-async-handler');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private/Admin
const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find()
    .sort('-createdAt')
    .limit(50)
    .populate('user', 'firstName lastName email');
  
  res.json(activities);
});

// Helper to create activities
const logActivity = async (type, user, description, metadata = {}) => {
  await Activity.create({
    user,
    type,
    description,
    metadata
  });
};

module.exports = {
  getActivities,
  logActivity
};