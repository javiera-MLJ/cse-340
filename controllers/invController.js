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
        title:`${vehicleData.inv_make} ${vehicleData.inv_model}`,
        nav,
        vehicleHTML,
    })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        classification_name: ""
    })
}

/* ****************************************
*  Process new classification
* *************************************** */
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name} = req.body

    const regResult = await invModel.addClassification(
        classification_name,
    )

    if (regResult) {
        req.flash(
            "notice",
            `The classification was successfully added.`
        )
        res.status(201).redirect("/inv/")
    }else {
        req.flash("notice", "Sorry, the classification could not be added.")
        res.status(500).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
            classification_name
        })
    }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("./inventory/management", {
            title: "Vehicle Management",
            nav,
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Deliver add inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        classificationList,
        inv_make:"",
        inv_model:"",
        inv_year:"",
        inv_description:"",
        inv_image:"",
        inv_thumbnail:"",
        inv_price:"",
        inv_miles:"",
        inv_color:""
    })
}

/* ****************************************
*  Process new inventory item
* *************************************** */
invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)

    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
    } = req.body

    const addResult = await invModel.addInventory(
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
    )

    if (addResult) {
        req.flash("notice", `The new vehicle was successfully added.`)
        res.status(201).redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, the vehicle could not be added.")
        res.status(500).render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            errors: null,
            classificationList,
            // Sticky fields
            classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        })
    }
}
module.exports = invCont