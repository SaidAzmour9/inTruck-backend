const { check, validationResult, body } = require('express-validator');

const validation = {
    validateUser: [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Invalid email address'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 character'),
        check('phone').matches(/^\+?\d{10,15}$/).withMessage('Phone number is required'),
        //company
        check('city').if(body('userType').equals('Company')).notEmpty().withMessage('City is required'),
        check('address').if(body('userType').equals('Company')).notEmpty().withMessage('Address is required'),
        check('ice').if(body('userType').equals('Company')).notEmpty().withMessage('Ice is required'),
        //individual
        check('cin').if(body('userType').equals('Individual')).notEmpty().withMessage('Cin is required'),
        check('name').if(body('userType').equals('Individual')).notEmpty().withMessage('Name is required'),
    ],
    validateLogin: [
        check('email')
            .isEmail()
            .withMessage('Invalid email address'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters'),
    ],
    validateForgotPassword: [
        check('email')
            .isEmail()
            .withMessage('Invalid email address'),
    ],
    validateResetPassword: [
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 character'),
        check('confirmPassword').isLength({ min: 8 }).withMessage('Confirm Password must be same of password ')
        ],

};


const errorValidatorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed',
            //return first eror,
            errors: errors.array()[0].msg
        });
    }
    next();
}; 

module.exports = { validation, errorValidatorHandler };
