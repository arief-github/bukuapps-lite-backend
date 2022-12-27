module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define('comments', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        comment: {
            type: Sequelize.STRING
        }
    });

    return Comments;
}