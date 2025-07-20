// routes/activityRoutes.js
const express = require('express');
const { getActivities } = require('../controllers/activityController');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect, admin, getActivities);

module.exports = router;