const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mainController');
const { protect, adminOnly } = require('../middleware/auth');
router.get('/', ctrl.getPrograms);
router.post('/', protect, adminOnly, ctrl.createProgram);
router.put('/:id', protect, adminOnly, ctrl.updateProgram);
router.delete('/:id', protect, adminOnly, ctrl.deleteProgram);
module.exports = router;
