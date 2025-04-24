const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getProfile, updateProfile } = require('../controllers/companyProfileController');

router.get('/', auth, getProfile);
router.post('/', auth, updateProfile);

module.exports = router;
