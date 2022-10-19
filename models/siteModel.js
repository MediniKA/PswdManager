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
        enum:["Social Media", "Payment App", "Entertainment"],
        required:true,  
    },
    userName:{
        type:String,
        required:true
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
},{timestamps:true})

module.exports = mongoose.model("Site", SiteSchema)