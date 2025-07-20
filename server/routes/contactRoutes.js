// routes/contactRoutes.js
const express = require('express');
const {
  submitContactForm,
  getContactSubmissions,
  updateContactStatus
} = require('../controllers/contactController');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .post(submitContactForm)
  .get(protect, admin, getContactSubmissions);

router.route('/:id')
  .put(protect, admin, updateContactStatus);

module.exports = router;