const express =  require('express')
const { signup, signin, logout } = require('../controllers/userController')
const auth = require('../middlewares/auth')
const userRouter = express.Router()


userRouter.post("/signup",signup)
userRouter.post("/signin", signin)
userRouter.get("/logout",auth,logout)


module.exports = userRouter
