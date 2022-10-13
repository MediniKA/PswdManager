const mongoose = require("mongoose")

const SiteSchema = mongoose.Schema({
    URL:{
        type:String,
        required:true
    },
    SiteName:{
        type:String,
        required:true
    },
    Sector:{
        type:String,
        required:true,  
    },
    
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
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