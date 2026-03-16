const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mainController');
const { protect, adminOnly } = require('../middleware/auth');
router.post('/', ctrl.submitContact);
router.get('/', protect, adminOnly, ctrl.getContacts);
router.patch('/:id/read', protect, adminOnly, ctrl.markContactRead);
module.exports = router;
