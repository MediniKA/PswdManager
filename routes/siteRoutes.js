const express =  require('express')
const { getSites, createSite, deleteSite, updateSite, searchSite, getPassword } = require('../controllers/siteController')
const auth = require('../middlewares/auth')
const siteRouter = express.Router()

siteRouter.get("/",auth, getSites)
siteRouter.post("/",auth, createSite)
siteRouter.delete("/:id",auth, deleteSite)
siteRouter.put("/:id",auth, updateSite)
siteRouter.get("/search",auth,searchSite)
siteRouter.get("/viewPassword",auth,getPassword)


module.exports = siteRouter
