const { check, validationResult, body } = require('express-validator');

const validation = {
    validateUser : [
        check("email").isEmail().withMessage("Invalid email address"),
        check("password")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters"),
        check("phone")
          .matches(/^\+?\d{10,15}$/)
          .withMessage("Phone number must be between 10 and 15 digits"),
        check("userType")
          .isIn(["Individual", "Company"])
          .withMessage("User type must be 'Individual' or 'Company'"),
        check("address").notEmpty().withMessage("Address is required"),
      
        // Company-specific fields
        check("companyName")
          .if(body("userType").equals("Company"))
          .notEmpty()
          .withMessage("Company name is required"),
        check("rc")
          .if(body("userType").equals("Company"))
          .notEmpty()
          .withMessage("Commercial registration number (RC) is required"),
        check("nIf")
          .if(body("userType").equals("Company"))
          .notEmpty()
          .withMessage("Tax identification number (NIF) is required"),
        check("responsableName")
          .if(body("userType").equals("Company"))
          .isString()
          .withMessage("Responsible name must be a string"),
      
        // Individual-specific fields
        check("fullName")
          .if(body("userType").equals("Individual"))
          .notEmpty()
          .withMessage("Full name is required for individuals"),
        check("nationalId")
          .if(body("userType").equals("Individual"))
          .notEmpty()
          .withMessage("National ID is required"),
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
