const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    mobileNumber:{
        type:Number,
        required:true,
        validate:{
            validator:function(val){
                return val.toString().length===10;
            }, message:(val)=> `{$val.value} has to be 10 digit`,
        },
    },
    MPin:{
        type:String,
        required:true,  
    }
},{timeStamp:true})

module.exports = mongoose.model("User", UserSchema)
