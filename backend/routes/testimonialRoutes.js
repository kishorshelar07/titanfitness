const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mainController');
const { protect, adminOnly } = require('../middleware/auth');
router.get('/', ctrl.getTestimonials);
router.post('/', protect, adminOnly, ctrl.createTestimonial);
module.exports = router;
