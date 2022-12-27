const db = require('../configs/db')
const Users = db.users
const Roles = db.roles
const RolesUser = db.rolesUsers
const asyncMiddleware = require('express-async-handler')
var bcrypt = require("bcryptjs")

exports.getUsersWithRole = asyncMiddleware(async(req, res) => {
    try {
        const user = await Users.findAll({
            attributes: ['id', 'name', 'username', 'email'],
            include: [{
                model: Roles,
                attributes: ['id', 'name'],
                through: {
                    attributes: ['userId', 'roleId']
                }
            }]
        })
        res.status(200).json({
            data: user,
            message: "Succesfully fetch all User"
        })
    } catch (error) {
        res.status(500).send({
            error: error,
            message: "Failed to fetch users"
        })
    }
})

exports.userContent = asyncMiddleware(async(req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                id: req.userId
            },
            attributes: ['name', 'username', 'email'],
            include: [{
                model: Roles,
                attributes: ['name'],
                through: {
                    attributes: ['roleId']
                }
            }]
        });
        res.status(200).json({
            description: 'User Content Page',
            data: user
        })
    } catch (error) {
        res.status(500).send({
            error: error,
            message: 'Failed to fetch data user content'
        })
    }
})

exports.getUserRoleById = asyncMiddleware(async(req, res) => {
    try {
        const idUser = req.params.id
        const user = await RolesUser.findOne({
            where: {
                userId: idUser
            },
            attributes: ['userId', 'roleId']
        })
        res.status(200).send({
            data: user,
            message: `Succesfully get user by id ${idUser}`
        })
    } catch (error) {
        res.status(500).send({
            error: error,
            message: `Failed to retrieve data user with id ${idUser}`
        })
    }
})

exports.putUser = asyncMiddleware(async(req, res) => {
    try {
        const idUser = req.userId
        const datauser = await Users.findOne({
            where: {
                id: idUser
            }
        })

        const passwordIsValid = bcrypt.compareSync(req.body.password, datauser.password)
        if (!passwordIsValid) {
            return res.status(401).send({
                auth: false,
                accessToken: null,
                message: "invalid password"
            })
        }
        console.log(passwordIsValid)

        const user = await Users.update({
            name: req.body.name,
            username: req.body.username,
            role: req.body.role
        }, {
            where: {
                id: idUser
            }
        })
        res.status(201).send({
            data: user,
            message: "User data succesfully updated"
        })
        console.log(passwordIsValid)
    } catch (error) {
        res.status(500).send({
            error: error,
            message: "Failed to update data"
        })
    }
})

exports.putUserRole = asyncMiddleware(async(req, res) => {
    try {
        const idUser = req.params.id
        const userRole = await RolesUser.update({
            roleId: req.body.roleId
        }, {
            where: {
                userId: idUser
            }
        })
        res.status(201).send({
            data: userRole,
            message: "User role successfuly updated"
        })
    } catch (error) {
        res.status(500).send({
            error: error,
            message: "Failed to update User role"
        })
    }
})

exports.getUserById = asyncMiddleware(async(req, res) => {
    userId = req.userId
    try {
        const user = await Users.findOne({
            where: {
                id: userId
            }
        })
        res.status(200).send({
            data: user,
            message: `user succesfully fetched`
        })
    } catch (error) {
        console.log(error);
    }
})