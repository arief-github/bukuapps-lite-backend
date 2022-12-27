const {
    check, validationResult
} = require('express-validator')

checkRegisterInput = [
    check('name').notEmpty().withMessage('Name must be fill'),
    check('username').notEmpty().withMessage('Username must be fill'),
    check('email').notEmpty().withMessage('Email must be fill').isEmail().withMessage('Email format invalid'),
    check('password').notEmpty().withMessage('Password must be fill').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    check('role').notEmpty().withMessage('Role must be fill'),
    (req, res, next) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(422).send({
                message: error
            })
        } next()
    }
]

checkBookInput = [
    check('title').notEmpty().withMessage('Title must be fill'),
    check('author').notEmpty().withMessage('Author must be fill'),
    check('publishedDate').notEmpty().withMessage('Published Date must be fill'),
    check('pages').notEmpty().withMessage('Pages must be fill'),
    check('language').notEmpty().withMessage('Language must be fill'),
    check('publisherId').notEmpty().withMessage('Publisher must be fill'),
    (req, res, next) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(422).json({
                message: error
            })
        } next()
    }
]

const inputValidation = {}
inputValidation.checkRegisterInput = checkRegisterInput
inputValidation.checkBookInput = checkBookInput
module.exports = inputValidation

