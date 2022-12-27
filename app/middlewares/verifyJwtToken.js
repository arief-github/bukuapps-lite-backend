const jwt = require("jsonwebtoken")
const config = require('../configs/config')
const db = require('../configs/db')
const Role = db.roles
const Users = db.users

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"] // Express headers are auto converted to lowercase
    if (token != null && token.startsWith("Bearer")) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
    }
    if (!token) {
        return res.status(403).send({
            auth: false,
            message: "No token provided."
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: "Fail to Authentication. Error -> " + err
            });
        }
        req.userId = decoded.id;
        next();
    });
};

isUser = (req, res, next) => {
    Users.findByPk(req.userId)
        .then(user => {
            user.getRoles()
                .then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                        console.log(roles[i].name)
                        if (roles[i].name.toUpperCase() === "USER") {
                            next()
                            return
                        }
                    }
                    res.status(403).send({
                        warning: "Require User Account"
                    })
                    return
                })
        })
}

isAdmin = (req, res, next) => {
    Users.findByPk(req.userId)
        .then(user => {
            user.getRoles()
                .then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                        console.log(roles[i].name)
                        if (roles[i].name.toUpperCase() === "ADMIN") {
                            next()
                            return
                        }
                    }
                    res.status(403).send({
                        warning: "Require Admin Account"
                    })
                    return
                })
        })
}

const authJwt = {}
authJwt.verifyToken = verifyToken
authJwt.isAdmin = isAdmin
authJwt.isUser = isUser

module.exports = authJwt