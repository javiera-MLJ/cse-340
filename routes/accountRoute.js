// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const auth = require("../utilities/auth-middleware")

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
    utilities.handleErrors(accountController.accountLogin)
)

// Account management
router.get(
    "/accountManagement",
    auth.requireAuth,
    utilities.handleErrors(accountController.buildAccountManagement)
)

// Update view 
router.get(
    "/update/:account_id",
    auth.requireAuth,
    utilities.handleErrors(accountController.buildUpdateView)
)

// Update account (POST)
router.post(
    "/update",
    auth.requireAuth,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateAccount,
    utilities.handleErrors(accountController.updateAccount)
)

// Change password (POST)
router.post(
    "/update-password",
    auth.requireAuth,
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePassword,
    utilities.handleErrors(accountController.updatePassword)
)

// Logout (GET)
router.get("/logout",  
    utilities.handleErrors(accountController.logout))


module.exports = router;