const db = require('../configs/db')
const config = require('../configs/config')
const Users = db.users
const Roles = db.roles
const rolesUsers = db.rolesUsers
const asyncMiddleware = require("express-async-handler")
const Op = db.Sequelize.Op
var jwt = require("jsonwebtoken")
var bcrypt = require("bcryptjs")

exports.signUp = asyncMiddleware(async (req, res) => {
    // Save User to Database
    try {
        const user = await Users.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        })
        const role = await Roles.findAll({
            where: {
                name: {
                    [Op.or]: req.body.role
                }
            }
        })
        await user.setRoles(role)
        res.status(201).send({
            message: "User succesfully registered"
        })
    }
    catch (error) {
        res.status(500).send({
            message: "Failed to register"
        })
    }
})

exports.signIn = asyncMiddleware(async (req, res) => {
    const user = await Users.findOne({
        where: {
            username: req.body.username
        }
    })
    if (!user) {
        return res.status(404).send({
            auth: false,
            accessToken: null,
            message: "Failed to Login, Username not found"
        })
    }

    const roleUser = await rolesUsers.findOne({
        where: {
            userId: user.id
        }
    })

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid) {
        return res.status(401).send({
            auth: false,
            accessToken: null,
            message: "Failed to Login, invalid Username or password"
        })
    }

    const token = jwt.sign({
        id: user.id
    }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    })

    res.status(200).send({
        auth: true,
        type: "Bearer",
        accessToken: token,
        role: roleUser.roleId
    })
})

exports.checkRole = asyncMiddleware(async (req, res) => {
    const userId = req.userId
    Users.findByPk(userId)
        .then(user => {
            user.getRoles()
                .then(role => {
                    res.status(200).send({
                        data: role
                    })
                })
        })
})