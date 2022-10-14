const { rawListeners } = require("../models/siteModel");
const siteModel = require("../models/siteModel")
const Cryptr = require('cryptr');




const createSite = async(req,res) =>{
    const cryptr = new Cryptr(process.env.CRYTR_SECRET);
    // console.log(process.env.CRYTR_SECRET)
    const {URL,SiteName,Sector,userName,Password,notes} = req.body;
    const encryptedString = cryptr.encrypt(Password);
    const newSite = new siteModel({
        URL:URL,
        SiteName:SiteName,
        Sector:Sector,
        userName:userName,
        Password:encryptedString,
        notes:notes,
        userId:req.userId
    })

    try{
        await newSite.save();
        res.status(201).json(newSite);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
}

const updateSite = async(req,res) =>{
    const id = req.params.id;
    const {URL,SiteName,Sector,userName,Password,notes} = req.body;
    const newSite={
        URL:URL,
        SiteName:SiteName,
        Sector:Sector,
        userName:userName,
        Password:Password,
        notes:notes,
        userId:req.userId
    }

    try{
        const update = await siteModel.findByIdAndUpdate(id,newSite, {new:true})
        console.log(update)
        res.status(200).json(newSite);
    }catch (error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
}

const deleteSite = async(req,res) =>{
    const id = req.params.id;
    try{
        const site= await siteModel.findByIdAndRemove(id)
        res.status(202).json(site)
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
}

const searchSite = async(req,res) =>{

    try{
        const result = await siteModel.find({
            $or: [
                {SiteName:{$regex: req.body.text}},
                {userName:{$regex: req.body.text}},
                {notes:{$regex: req.body.text}},
            ]
    
        })
        res.status(200).json(result)
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
}



const getSites = async(req,res) =>{

    try{
        const sites = await siteModel.find({userId:req.userId})
        res.status(200).json(sites)
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
}
module.exports = {
    createSite,
    updateSite,
    deleteSite,
    getSites,
    searchSite
}