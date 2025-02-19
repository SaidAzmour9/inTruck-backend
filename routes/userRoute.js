const express = require('express');
const router = express.Router();
const {signUp, login,logOut} = require('../controllers/userController');
const { validation, errorValidatorHandler} = require('../middlewares/validator');
const auth = require('../middlewares/auth')


router.post('/signUp',validation.validateUser,errorValidatorHandler,signUp);
router.post('/login',validation.validateLogin,errorValidatorHandler,login)
router.get('/logout',auth,logOut);

module.exports = router;