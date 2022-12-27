const db = require('../configs/db')
const Users = db.users
const Books = db.books
const Comments = db.comments
const asyncMiddleware = require("express-async-handler")

exports.getAllBook = asyncMiddleware(async (req, res) => {
    try {
        const books = await Books.findAll()
        res.status(200).send({
            data: books,
            message: "Books succesfully fetch"
        })
    }
    catch (error) {
        res.status(500).send({
            error: error,
            message: "Cant fetch books"
        })
    }
})

exports.getBookById = asyncMiddleware(async (req, res) => {
    try {
        const bookId = req.params.id
        const book = await Books.findOne({
            where: {
                id: bookId
            }
        })
        res.status(200).send({
            data: book
        })
    } catch (error) {
        res.status(500).send({
            error: error,
            message: "failed to get data by id"
        })
    }
})

exports.postBook = asyncMiddleware(async (req, res) => {
    try {
        const book = await Books.create({
            title: req.body.title,
            author: req.body.author,
            publishedDate: req.body.publishedDate,
            pages: req.body.pages,
            language: req.body.language,
            publisherId: req.body.publisherId
        })
        res.status(201).send({
            data: book,
            message: 'Book Succesfully add'
        })
    }
    catch (error) {
        res.status(500).send({
            error: error,
            message: "Failed to add book"
        })
    }
})

exports.putBook = asyncMiddleware(async (req, res) => {
    try {
        const bookId = req.params.id
        const book = await Books.update({
            title: req.body.title,
            author: req.body.author,
            publishedDate: req.body.publishedDate,
            pages: req.body.pages,
            language: req.body.language,
            publisherId: req.body.publisherId
        }, {
            where: {
                id: bookId
            }
        })
        res.status(201).send({
            message: 'Book succesfully updated'
        })
    }
    catch (error) {
        res.status(500).send({
            message: "Failed to update book"
        })
    }
})

exports.deleteBook = asyncMiddleware(async (req, res) => {
    try {
        const bookId = req.params.id
        await Books.destroy({
            where: {
                id: bookId
            }
        })
        res.status(200).send({
            message: 'Book succesfully deleted'
        })
    }
    catch (error) {
        res.status(500).send({
            error: error,
            message: "Failed to delete book"
        })
    }
})

exports.getBookDetail = asyncMiddleware(async (req, res) => {
    try {
        const bookDetail = await Books.findAll({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'title', 'author', 'publishedDate', 'pages', 'language', 'publisherId'],
            include: [{
                model: Comments,
                attributes: ['id', 'comment'],
                include: {
                    model: Users,
                    attributes: ['username']
                }
            }]
        })
        res.status(200).send({
            data: bookDetail,
            message: "Book detil succesfully fetched"
        })
    } catch (error) {
        res.status(500).send({
            message: "Failed to fetch book detail"
        })
    }
})