const express =  require('express')
const { signup, signin, logout, GetNewAccessToken, getOtp, verifyOtp, forgotPassword } = require('../controllers/userController')
const auth = require('../middlewares/auth')
const userRouter = express.Router()


userRouter.post("/signup",signup)
userRouter.post("/signin", signin)
userRouter.get("/logout",auth,logout)
// userRouter.post("/getrefresh",getRefresh)
// userRouter.post("/getAccessToken",getAccessToken)
userRouter.post("/getAccess",GetNewAccessToken)
userRouter.get("/getOtp",getOtp)
userRouter.post("/verifyOtp",verifyOtp)


module.exports = userRouter
