const utilities = require(".")
    const { body, validationResult } = require("express-validator")
    const validate = {}
    const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
    validate.registrationRules = () => {
        return [
            // firstname is required and must be string
            body("account_firstname")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 1 })
                .withMessage("Please provide a first name."), // on error this message is sent.
            
            // lastname is required and must be string
            body("account_lastname")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 2 })
                .withMessage("Please provide a last name."), // on error this message is sent.
            
            // valid email is required and cannot already exist in the database
            body("account_email")
                .trim()
                .isEmail()
                .normalizeEmail() // refer to validator.js docs
                .withMessage("A valid email is required.")
                .custom(async (account_email) => {
                    const emailExists = await accountModel.checkExistingEmail(account_email)
                    if (emailExists){
                        throw new Error("Email exists. Please log in or use different email")
                    }
                }),
            
            // password is required and must be strong password
            body("account_password")
                .trim()
                .notEmpty()
                .isStrongPassword({
                    minLength: 12,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                })
                .withMessage("Password does not meet requirements."),
        ]
    }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
    validate.loginRules = () => {
        return [
            // valid email is required and cannot already exist in the database
            body("account_email")
                .trim()
                .isEmail()
                .normalizeEmail() // refer to validator.js docs
                .withMessage("A valid email is required.")
                .custom(async (account_email) => {
                    const emailExists = await accountModel.checkExistingEmail(account_email)
                    if (!emailExists){
                        throw new Error("Email does not exists. Please register first.")
                    }
                }),
            
            // password is required and must be strong password
            body("account_password")
                .trim()
                .notEmpty()
                .withMessage("Please enter your password."),
        ]
    }

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
    const {account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

validate.updateAccountRules = () => {
    return [
        body("account_firstname")
            .trim()
            .notEmpty()
            .withMessage("First name is required."),
        body("account_lastname")
            .trim()
            .notEmpty()
            .withMessage("Last name is required."),
        body("account_email")
            .trim()
            .isEmail()
            .withMessage("Valid email is required.")
            .custom(async (account_email, { req }) => {
                const current = await accountModel.getAccountById(parseInt(req.body.account_id))
                if (current.account_email !== account_email) {
                    const exists = await accountModel.getAccountByEmail(account_email)
                    if (exists) throw new Error("Email already in use.")
                }
                return true
            })
    ]
}

validate.checkUpdateAccount = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        return res.status(400).render("account/update", {
            title: "Update Account",
            nav,
            errors: errors.array(),
            notice: req.flash("notice"),
            account_id: req.body.account_id,
            account_firstname: req.body.account_firstname,
            account_lastname: req.body.account_lastname,
            account_email: req.body.account_email
        })
    }
    next()
}

validate.updatePasswordRules = () => {
    return [
        body("account_password")
            .isLength({ min: 12 }).withMessage("Password must be at least 12 characters.")
            .matches(/[A-Z]/).withMessage("Include an uppercase letter.")
            .matches(/[a-z]/).withMessage("Include a lowercase letter.")
            .matches(/[0-9]/).withMessage("Include a number.")
            .matches(/[^A-Za-z0-9]/).withMessage("Include a symbol.")
    ]
}

validate.checkUpdatePassword = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        return res.status(400).render("account/update", {
            title: "Update Account",
            nav,
            errors: errors.array(),
            notice: req.flash("notice"),
            account_id: req.body.account_id,
            account_firstname: req.body.account_firstname,
            account_lastname: req.body.account_lastname,
            account_email: req.body.account_email
        })
    }
    next()
}


module.exports = validate