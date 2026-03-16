const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mainController');
const { protect, adminOnly } = require('../middleware/auth');
router.post('/enroll', ctrl.enrollMembership);
router.get('/', protect, adminOnly, ctrl.getMemberships);
router.get('/stats', protect, adminOnly, ctrl.getDashboardStats);
module.exports = router;
