const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
    refresh_token:String,
    // mobileNumber:Number,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    created: {
        type: Date,
        default: new Date().toISOString()
    }
})
module.exports = mongoose.model("refreshToken", refreshTokenSchema)