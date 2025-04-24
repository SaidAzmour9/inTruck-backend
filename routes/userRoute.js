const express = require('express');
const router = express.Router();
const { signUp, login, logOut, forgetPassword, resetPassword, getUserProfile, getAllUsers } = require('../controllers/userController');
const { validation, errorValidatorHandler } = require('../middlewares/validator');
const auth = require('../middlewares/auth');

router.post('/register', validation.validateUser, errorValidatorHandler, signUp);
router.post('/login', validation.validateLogin, errorValidatorHandler, login);
router.get('/profile', auth, getUserProfile); // Protected route for getting user profile
router.get('/users', auth, getAllUsers);
router.get('/logout', auth, logOut);
router.post('/forgetPassword', validation.validateForgotPassword, forgetPassword);
router.post('/reset_password/:token', validation.validateResetPassword, resetPassword);

module.exports = router;
