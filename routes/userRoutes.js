const express =  require('express')
const { signup, signin, logout, GetNewAccessToken, getOtp, verifyOtp, forgotPassword, resetPassword, resetMPin } = require('../controllers/userController')
const auth = require('../middlewares/auth')
const userRouter = express.Router()


userRouter.post("/signup",signup)
userRouter.post("/signin", signin)
userRouter.delete("/logout",auth,logout)
// userRouter.post("/getrefresh",getRefresh)
// userRouter.post("/getAccessToken",getAccessToken)
userRouter.post("/getAccess",GetNewAccessToken)
userRouter.get("/getOtp",getOtp)
userRouter.post("/forgotPassword",verifyOtp, forgotPassword)
userRouter.patch("/resetPassword", auth, resetPassword);
userRouter.post('/resetMPin',auth, resetMPin)

module.exports = userRouter
