const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// POST /api/contact - Submit contact form
router.post('/contact', contactController.submitContact);

module.exports = router;
