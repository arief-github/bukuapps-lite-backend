module.exports = (sequelize, Sequelize) => {
    const Books = sequelize.define('books', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        author: {
            type: Sequelize.STRING
        },
        publishedDate: {

            type: Sequelize.DATEONLY
        },
        pages: {
            type: Sequelize.STRING
        },
        language: {
            type: Sequelize.STRING
        },
        publisherId: {
            type: Sequelize.STRING
        }
    });

    return Books;
}