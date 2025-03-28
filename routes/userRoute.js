const express = require('express');
const router = express.Router();
const {signUp, login,logOut,forgetPassword,resetPassword} = require('../controllers/userController');
const { validation, errorValidatorHandler} = require('../middlewares/validator');
const auth = require('../middlewares/auth')


router.post('/register',validation.validateUser,errorValidatorHandler,signUp);
router.post('/login',validation.validateLogin,errorValidatorHandler,login)
router.get('/logout',auth,logOut);
router.post('/forgetPassword',validation.validateForgotPassword ,forgetPassword);
router.post('/reset_password/:token',validation.validateResetPassword ,resetPassword);




module.exports = router;