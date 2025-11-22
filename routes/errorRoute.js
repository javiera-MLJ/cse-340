const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/index")

router.get("/cause500", utilities.handleErrors(errorController.throw500))

module.exports = router