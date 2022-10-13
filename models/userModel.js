const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    mobileNumber:{
        type:Number,
        required:true
    },
    MPin:{
        type:String,
        required:true,  
    }
},{timeStamp:true})

module.exports = mongoose.model("User", UserSchema)