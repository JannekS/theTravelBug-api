const { check, validationResult } = require('express-validator');
const User = require('../models/user');

const checkEmail = (method) => {
    const emailValidation = [
        check('email')
            .not().isEmpty().withMessage('Email is required.')
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail()
    ];
    if (method === 'signup') {
        emailValidation.push(
            check('email').custom(async (value, { req }) => {
                const userDoc = await User.findOne({ email: value });
                if (userDoc) {
                    throw new Error('Signup failed. A user with this email alreadey exists. Please try again.');
                }
                return true;
            })
        );   
    }
    return emailValidation;
};
const checkPassword = (method) => {
    const pwValidation = [
        check('password')
            .not().isEmpty().withMessage('You must enter a enter a password.')
            .isStrongPassword({ minLength: 12 })
            .withMessage('This password is not complex enough. Your password must be at least 12 characters long and it must contain at least one number, one uppercase letter, one lowercase letter and one symbol.')
    ];    
    if (method === 'signup') {
        pwValidation.push(
            check('confirmPassword')
                .not().isEmpty().withMessage('You must confirm your password in oder to sign up.')
                .custom((value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error("The passwords don't match. Please retype your password.");
                    }
                    return true;
                })
                .trim()
        );
    }  
    return pwValidation;
}

exports.validateLogin = [
    checkEmail(),
    checkPassword()
];    

exports.validateSignup = [
    check('name')
        .trim()
        .isLength({min: 3}).withMessage('You must enter a username in order to sign up. It should have at least 3 characters.'),
    checkEmail('signup'),
    checkPassword('signup')
];
    
exports.errorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    next();
}