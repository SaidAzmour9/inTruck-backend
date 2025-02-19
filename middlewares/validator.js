const { check, validationResult } = require('express-validator');

const validation = {
    validateUser: [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Invalid email address'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 character'),
        check('phone').matches(/^\+?\d{10,15}$/).withMessage('Phone number is required')
    ],
    validateLogin: [
        check('email')
            .isEmail()
            .withMessage('Invalid email address'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters'),
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
