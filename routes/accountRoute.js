// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

/* ================================
    LOGIN ROUTE (GET)
    - Displays the login view
   ================================= */
router.get(
    "/login",
    utilities.handleErrors(accountController.buildLogin)
);

/* ================================
    REGISTRATION ROUTE (GET)
    - Displays the registration form
   ================================= */
router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister)
);

/* ================================
    REGISTRATION ROUTE (POST)
    - Handles form submission
    - Creates a new user account
   ================================= */
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

/* ================================
    LOGIN ROUTE (POST)
    - Validates login data
    - Processes login attempt
   ================================= */
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.login)
)
module.exports = router;