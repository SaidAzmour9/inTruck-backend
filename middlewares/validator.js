const { check, validationResult, body } = require('express-validator');

// Constant for allowed user types
const allowedUserTypes = ["Individual", "Company", "ADMIN"];

const validation = {
  validateUser: [
    check("email")
      .isEmail()
      .withMessage("Invalid email address"),
      
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),

    check("userType")
      .isIn(allowedUserTypes)
      .withMessage(`User type must be one of: ${allowedUserTypes.join(", ")}`),

    // If userType is Company
    check("phone")
      .if(body("userType").equals("Company"))
      .matches(/^\+?\d{10,15}$/)
      .withMessage("Phone number must be between 10 and 15 digits"),

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

    check("address")
      .if(body("userType").equals("Company"))
      .notEmpty()
      .withMessage("Address is required"),

    // If userType is Individual
    check("phone")
      .if(body("userType").equals("Individual"))
      .matches(/^\+?\d{10,15}$/)
      .withMessage("Phone number must be between 10 and 15 digits"),

    check("fullName")
      .if(body("userType").equals("Individual"))
      .notEmpty()
      .withMessage("Full name is required for individuals"),

    check("nationalId")
      .if(body("userType").equals("Individual"))
      .notEmpty()
      .withMessage("National ID is required"),

    check("address")
      .if(body("userType").equals("Individual"))
      .notEmpty()
      .withMessage("Address is required"),
      
    // If userType is ADMIN, no extra fields are required (only email, password, userType)
  ],

  validateLogin: [
    check('email')
      .isEmail()
      .withMessage('Invalid email address'),

    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],

  validateProfileData: [
    check("email")
      .isEmail()
      .withMessage("Invalid email address"),

    // If userType is Company
    check("phone")
      .if(body("userType").equals("Company"))
      .matches(/^\+?\d{10,15}$/)
      .withMessage("Phone number must be between 10 and 15 digits"),

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

    check("address")
      .if(body("userType").equals("Company"))
      .notEmpty()
      .withMessage("Address is required"),

    // If userType is Individual
    check("phone")
      .if(body("userType").equals("Individual"))
      .matches(/^\+?\d{10,15}$/)
      .withMessage("Phone number must be between 10 and 15 digits"),

    check("fullName")
      .if(body("userType").equals("Individual"))
      .notEmpty()
      .withMessage("Full name is required for individuals"),

    check("nationalId")
      .if(body("userType").equals("Individual"))
      .notEmpty()
      .withMessage("National ID is required"),

    check("address")
      .if(body("userType").equals("Individual"))
      .notEmpty()
      .withMessage("Address is required"),

  ],
    

  validateForgotPassword: [
    check('email')
      .isEmail()
      .withMessage('Invalid email address'),
  ],

  validateResetPassword: [
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),

    check('confirmPassword')
      .isLength({ min: 8 })
      .withMessage('Confirm Password must match password'), // You might want to add more matching logic here
  ],

  validateOrder: [
    check('name').isString().withMessage('Name must be a string'),
    check('shipment_range').isString().withMessage('Shipment range must be a string'),
    check('shipping_address').isString().withMessage('Shipping address must be a string'),
    check('pickup_loc').isString().withMessage('Pickup location must be a string'),
    check('pickup_time').isString().withMessage('Pickup time must be a string'),
    check('pickup_date').isString().withMessage('Pickup date must be a string'),
    check('delivery_loc').isString().withMessage('Delivery location must be a string'),
    check('delivery_date').isString().withMessage('Delivery date must be a string'),
    check('width').isNumeric().withMessage('Width must be a number'),
    check('height').isNumeric().withMessage('Height must be a number'),
    check('weight').isNumeric().withMessage('Weight must be a number'),
    check('quantity').isNumeric().withMessage('Quantity must be a number'),
    check('shipment_info').isString().withMessage('Shipment info must be a string'),
    check('package_type').isString().withMessage('Package type must be a string'),
    check('shipment_note').isString().withMessage('Shipment note must be a string'),
    check('payment_method').isString().withMessage('Payment method must be a string'),
    check('price').isNumeric().withMessage('Price must be a number'),
    check('delivery_loc').isString().withMessage('Delivery location must be a string'),
    check('delivery_city').isString().withMessage('Delivery city must be a string'),
    check('pickup_city').isString().withMessage('Pickup city must be a string'),
  ]
};

// Error Handler Middleware
const errorValidatorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array()[0].msg // return only the first error
    });
  }
  next();
};

module.exports = { validation, errorValidatorHandler };
