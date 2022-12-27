const db = require('../configs/db')

const Comments = db.comments
const asyncMiddleware = require('express-async-handler')

exports.postComment = asyncMiddleware(async (req, res) => {
    try {
        const comment = await Comments.create({
            bookId: req.params.id,
            comment: req.body.comment,
            userId: req.userId
        })
        res.status(201).send({
            data: comment,
            message: "Comment successfuly added"
        })
    } catch (error) {
        res.status(500).send({
            error: error,
            message: "Failed to add comment"
        })

    }
})

