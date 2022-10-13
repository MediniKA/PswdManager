const express =  require('express')
const { getSites, createSite, deleteSite, updateSite } = require('../controllers/siteController')
const auth = require('../middlewares/auth')
const siteRouter = express.Router()

siteRouter.get("/",auth, getSites)
siteRouter.post("/",auth, createSite)
siteRouter.delete("/:id",auth, deleteSite)
siteRouter.put("/:id",auth, updateSite)

module.exports = siteRouter
