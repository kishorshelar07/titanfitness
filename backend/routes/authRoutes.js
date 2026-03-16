// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mainController');
const { protect } = require('../middleware/auth');
router.post('/login', ctrl.adminLogin);
router.get('/me', protect, ctrl.getMe);
module.exports = router;
