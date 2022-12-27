const verifySignUp = require('../middlewares/verifySignUp')
const verifyInput = require('../middlewares/verifyInput')
const authJwt = require('../middlewares/verifyJwtToken')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const commentController = require('../controllers/commentController')

module.exports = function (app) {
    // Auth
    app.post('/register', [verifyInput.checkRegisterInput, verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], authController.signUp)//done
    app.post('/login', authController.signIn)//admin role done
    app.get('/auth', [authJwt.verifyToken], authController.checkRole)//admin role done

    // user book
    app.get('/user/book/all', [authJwt.verifyToken, authJwt.isUser], bookController.getAllBook)
    app.get('/user/book/detail/:id', [authJwt.verifyToken, authJwt.isUser], bookController.getBookDetail)
    app.post('/user/book/comment/:id', [authJwt.verifyToken, authJwt.isUser], commentController.postComment)
    //user profile
    app.get('/user/profile', [authJwt.verifyToken, authJwt.isUser], userController.getUserById)
    app.put('/user/profile/edit', [verifyInput.checkRegisterInput, authJwt.verifyToken, authJwt.isUser], userController.putUser)


    //admin profile
    app.get('/admin/profile', [authJwt.verifyToken, authJwt.isAdmin], userController.getUserById)
    //admin user
    app.get('/admin/user/all', [authJwt.verifyToken, authJwt.isAdmin], userController.getUsersWithRole) //admin role done
    // app.get('/admin/user/:id', [authJwt.verifyToken, authJwt.isAdmin], userController.getUserRoleById)
    app.put('/admin/user/:id', [authJwt.verifyToken, authJwt.isAdmin], userController.putUserRole)//admin role done
    //admin book
    app.get('/admin/book/all', [authJwt.verifyToken, authJwt.isAdmin], bookController.getAllBook)//admin role done
    app.get('/admin/book/all/:id', [authJwt.verifyToken, authJwt.isAdmin], bookController.getBookById) //admin role done
    app.post('/admin/book/add', [verifyInput.checkBookInput, authJwt.verifyToken, authJwt.isAdmin], bookController.postBook) //admin role done
    app.put('/admin/book/edit/:id', [verifyInput.checkBookInput, authJwt.verifyToken, authJwt.isAdmin], bookController.putBook) //admin role done
    app.delete('/admin/book/delete/:id', [authJwt.verifyToken, authJwt.isAdmin], bookController.deleteBook) //admin role done
    // error handler 404
    app.use(function (req, res, next) {
        return res.status(404).send({
            message: "Not Found"
        })
    })
    // error handler 500
    app.use(function (err, req, res, next) {
        return res.status(500).send({
            message: "something wrong",
        })
    })
}