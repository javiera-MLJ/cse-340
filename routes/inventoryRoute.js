// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const addValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build detailed view inventory
router.get(
    "/detail/:id",
    utilities.handleErrors(invController.buildItemDetailView)
);

// Route to build new name classification
router.get(
    "/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
)

// Add Classification route (post)
router.post(
    "/add-classification",
    addValidate.addClassificationRules(),
    addValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification)
)


// Route to build add inventory view
router.get(
    "/add-inventory",
    utilities.handleErrors(invController.buildAddInventory)
)

// Add Inventory route (post)
router.post(
    "/add-inventory",
    addValidate.addInventoryRules(),
    addValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Route to management page
router.get(
    "/",
    utilities.handleErrors(invController.buildManagement))


module.exports = router;