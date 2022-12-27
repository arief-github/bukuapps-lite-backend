module.exports = (sequelize, Sequelize) => {
    const UserRoles = sequelize.define('rolesUsers', {
        status: {
            type: Sequelize.STRING
        }
    });

    return UserRoles;
}