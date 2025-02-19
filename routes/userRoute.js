const express = require('express');
const router = express.Router();
const {signUp, login,logOut,forgetPassword,resetPassword} = require('../controllers/userController');
const { validation, errorValidatorHandler} = require('../middlewares/validator');
const auth = require('../middlewares/auth')


router.post('/signUp',validation.validateUser,errorValidatorHandler,signUp);
router.post('/login',validation.validateLogin,errorValidatorHandler,login)
router.get('/logout',auth,logOut);
router.post('/forgetPassword',forgetPassword);
router.post('/reset_password/:token', resetPassword);




module.exports = router;