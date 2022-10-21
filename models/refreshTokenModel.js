const mongoose = require('mongoose')

const RfreshTokenSchema = new mongoose.Schema({
    token:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports.mongoose.model("RefreshToken", RfreshTokenSchema)