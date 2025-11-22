const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildItemDetailView = async function (req,res, next) {
    const inv_id = req.params.id
    const vehicleData = await invModel.getVehicleById(inv_id)
    let nav = await utilities.getNav()
    const vehicleHTML = await utilities.buildVehicleDetailHTML(vehicleData)

    res.render("./inventory/detail", {
        title: `${vehicleData.make} ${vehicleData.model}`,
        nav,
        vehicleHTML,
    })
}

module.exports = invCont