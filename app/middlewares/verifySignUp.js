const db = require('../configs/db')
const config = require('../configs/config')
const Roles = config.roles
const Users = db.users

checkDuplicateUserNameOrEmail = (req, res, next) => {
    Users.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Username already taken"
            })
            return
        }
        Users.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Email already taken"
                })
                return
            }
            next()
        })
    })
}

checkRolesExisted = (req, res, next) => {
    for (let i = 0; i < req.body.role.length; i++) {
        if (!Roles.includes(req.body.role[i].toUpperCase())) {
            res.status(400).send({
                error: `Role ${req.body.role} doesnt exist`
            })
            return
        }
    }
    next()
}

const signUpVerify = {}
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail
signUpVerify.checkRolesExisted = checkRolesExisted

module.exports = signUpVerify