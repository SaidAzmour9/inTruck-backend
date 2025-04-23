const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/dashboardController');
const auth = require('../middlewares/auth');

// Get dashboard statistics
router.get('/statistics', auth, getStatistics);

module.exports = router;
