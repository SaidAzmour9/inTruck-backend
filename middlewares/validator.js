const { check, validationResult } = require('express-validator');

const validation = {
    validateUser: [
        check('fullName')
            .notEmpty()
            .withMessage('Name is required'),
        check('email')
            .isEmail()
            .withMessage('Invalid email address'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),
    ],
    validateLogin: [
        check('email')
            .isEmail()
            .withMessage('Invalid email address'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),
    ],
};

// ✅ معالجة جميع الأخطاء
const errorValidatorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed',
            errors: errors.array().map(err => err.msg) // عرض كل الأخطاء
        });
    }
    next();
};

module.exports = { validation, errorValidatorHandler };
