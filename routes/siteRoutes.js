const express =  require('express')
const siteRouter = express.Router()



siteRouter.get("/getAllSites", (req, res) =>{
    res.send("Site Details")
})
siteRouter.post("/addSite", (req, res) =>{
    res.send("Add Site")
})
siteRouter.patch("/EditSite", (req, res) =>{
    res.send("Edit Site")
})

module.exports = siteRouter