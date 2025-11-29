const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
 *  add classification Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .matches(/^[A-Za-z]+$/)
            .withMessage("Classification name must contain only letters. No spaces or special characters.")
    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

validate.addInventoryRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .withMessage("You must choose a classification.")
            .bail(),
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Make is required.")
            .bail(),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Model is required.")
            .bail(),
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Year is required.")
            .bail()
            .isInt({ min: 1900, max: 2100 })
            .withMessage("Year must be a valid number between 1900 and 2100."),
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Price is required.")
            .bail()
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Mileage is required.")
            .bail()
            .isInt({ min: 0 })
            .withMessage("Mileage must be a valid non-negative number."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Color is required.")
            .bail(),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Description is required.")
            .bail(),
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path is required.")
            .bail(),
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required.")
            .bail()
    ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkAddInventoryData = async (req, res, next) => {
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

    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)

        res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            errors,
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
        return
    }
    next()
}

module.exports = validate