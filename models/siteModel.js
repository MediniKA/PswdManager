const mongoose = require("mongoose")

const SiteSchema = mongoose.Schema({
    SiteName:{
        type:String,
        required:true
    },
    Sector:{
        type:String,
        required:true,  
    },
    UserName:{
        type:String,
        required:true,  
    },
    Password:{
        type:String,
        required:true,  
    },
    notes:{
        type:String
    }
},{timeStamp:true})

module.exports = mongoose.model("Site", SiteSchema)