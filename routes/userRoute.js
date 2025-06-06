const express = require('express');
const router = express.Router();
const { signUp, login, logOut, forgetPassword, resetPassword, checkAuthStatus, getUserProfile, updateUserProfile, getAllUsers } = require('../controllers/userController');
const { validation, errorValidatorHandler } = require('../middlewares/validator');
const auth = require('../middlewares/auth');
const auth2 = require('../middlewares/auth2');
const distanceController = require('../controllers/distanceController');

router.post('/register', validation.validateUser, errorValidatorHandler, signUp);
router.post('/login', validation.validateLogin, errorValidatorHandler, login);
router.get('/checkAuthStatus', auth, checkAuthStatus); 
router.get('/profile', auth2, getUserProfile); // Protected route for user profile
router.put('/updateProfile', auth2, validation.validateUpdateUser, errorValidatorHandler, updateUserProfile); // Protected route for updating user profile
router.get('/users', auth, getAllUsers);
router.get('/logout', auth, logOut);
router.post('/forgetPassword', validation.validateForgotPassword, forgetPassword);
router.post('/reset_password/:token', validation.validateResetPassword, resetPassword);
router.post('/distance', auth, distanceController.CalculDistance); // Protected route for calculating distance

const notificationController = require('../controllers/notificationController');

// Notification routes
router.get('/notifications', auth, notificationController.getNotificationsByUser);
router.patch('/notifications/:id/read', auth, notificationController.markNotificationAsRead);

module.exports = router;
