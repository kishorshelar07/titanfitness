const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mainController');
const { protect, adminOnly } = require('../middleware/auth');
router.get('/', ctrl.getTrainers);
router.post('/', protect, adminOnly, ctrl.createTrainer);
router.put('/:id', protect, adminOnly, ctrl.updateTrainer);
router.delete('/:id', protect, adminOnly, ctrl.deleteTrainer);
module.exports = router;
