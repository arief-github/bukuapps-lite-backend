const env = require('./env')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    logging: false,

    pool: {
        max: env.max,
        min: env.pool.min,
        acquire: env.pool.acquire,
        idle: env.pool.idle
    }
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('../../models/users')(sequelize, Sequelize)
db.roles = require('../../models/roles')(sequelize, Sequelize)
db.rolesUsers = require('../../models/rolesUsers')(sequelize, Sequelize)
db.books = require('../../models/books')(sequelize, Sequelize)
db.comments = require('../../models/comments')(sequelize, Sequelize)


db.roles.belongsToMany(db.users, {
    through: 'rolesUsers',
    foreignKey: 'roleId',
    otherKey: 'userId'
})
db.users.belongsToMany(db.roles, {
    through: 'rolesUsers',
    foreignKey: 'userId',
    otherKey: 'roleId'
})
db.books.hasMany(db.comments)
db.comments.belongsTo(db.books)
db.users.hasMany(db.comments)
db.comments.belongsTo(db.users)


module.exports = db