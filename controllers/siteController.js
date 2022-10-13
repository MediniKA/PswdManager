const { rawListeners } = require("../models/siteModel");
const siteModel = require("../models/siteModel")

const createSite = async(req,res) =>{
    const {URL,SiteName,Sector,Password,notes} = req.body;

    const newSite = new siteModel({
        URL:URL,
        SiteName:SiteName,
        Sector:Sector,
        Password:Password,
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
    const {URL,SiteName,Sector,Password,notes} = req.body;
    const newSite={
        URL:URL,
        SiteName:SiteName,
        Sector:Sector,
        Password:Password,
        notes:notes,
        userId:req.userId
    }

    try{
        await siteModel.findByIdAndUpdate(id,newSite, {new:true})
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
    getSites
}