// controllers/contactController.js
const Contact = require('../models/Contact');
const asyncHandler = require('express-async-handler');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message,phone } = req.body;

  const contact = await Contact.create({
    name,
    email,
    phone,
    message
  });

  res.status(201).json({
    success: true,
    data: contact
  });
});

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
const getContactSubmissions = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

// @desc    Update contact submission status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact submission not found');
  }

  contact.status = req.body.status || contact.status;
  const updatedContact = await contact.save();

  res.json(updatedContact);
});

module.exports = {
  submitContactForm,
  getContactSubmissions,
  updateContactStatus
};