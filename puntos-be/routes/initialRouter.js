const express = require("express")
const router = express.Router()

const initRouter = require('../controllers/initController')

router.get('/', initRouter.init)
module.exports = router