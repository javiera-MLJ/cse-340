// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const addValidate = require("../utilities/inventory-validation")
const auth = require("../utilities/auth-middleware")

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
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    utilities.handleErrors(invController.buildAddClassification)
)

router.post(
    "/add-classification",
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    addValidate.addClassificationRules(),
    addValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification)
)


// Route to build add inventory view
router.get(
    "/add-inventory",
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    utilities.handleErrors(invController.buildAddInventory)
)

router.post(
    "/add-inventory",
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    addValidate.addInventoryRules(),
    addValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Route to management page
router.get(
    "/",
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    utilities.handleErrors(invController.buildManagement)
)

// Route to management page with JSON
router.get(
    "/getInventory/:classification_id",
utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
    "/edit/:inv_id",
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    utilities.handleErrors(invController.editInventoryView)
)

router.post(
    "/update",
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    addValidate.addInventoryRules(),
    addValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Add inventory (GET/POST)
router.get(
    "/add",
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    utilities.handleErrors(invController.buildAddInventory)
)

router.post(
    "/add",
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    addValidate.addInventoryRules(),
    addValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Delete confirm (GET) y delete (POST)
router.get(
    "/delete/:inv_id",
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    utilities.handleErrors(invController.buildDeleteConfirm)
)

router.post(
    "/delete",
    auth.requireAuth,
    auth.requireRole(["Employee", "Admin"]),
    utilities.handleErrors(invController.deleteInventory)
)


router.get(
    "/all", 
    invController.buildFilteredVehicles);


module.exports = router;