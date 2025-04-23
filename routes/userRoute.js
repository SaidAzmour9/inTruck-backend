const express = require('express');
const router = express.Router();
const {signUp, login,logOut,forgetPassword,resetPassword,getUserProfile,getAllUsers,getCanceledInsurances} = require('../controllers/userController');
const { validation, errorValidatorHandler} = require('../middlewares/validator');
const auth = require('../middlewares/auth')


router.post('/register',validation.validateUser,errorValidatorHandler,signUp);
router.post('/login',validation.validateLogin,errorValidatorHandler,login)
//get user profile
router.get('/profile/:id',auth,getUserProfile);
// admin get all users
router.get('/users',auth,getAllUsers);
// get user's canceled insurances
router.get('/canceled-insurances',auth,getCanceledInsurances);
// router.put('/admin/user/role/:id',auth,updateUserRole);
router.get('/logout',auth,logOut);
router.post('/forgetPassword',validation.validateForgotPassword ,forgetPassword);
router.post('/reset_password/:token',validation.validateResetPassword ,resetPassword);





module.exports = router;