const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        return res.redirect("/account/login")
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        return res.redirect("/account/register")
    }
}



/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
            notice: req.flash("notice")
        })
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            res.cookie("jwt", accessToken, { httpOnly: true, secure: process.env.NODE_ENV !== 'development', maxAge: 3600 * 1000 })
            return res.redirect("/account/accountManagement")
        } else {
            req.flash("notice", "Please check your credentials and try again.")
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
                notice: req.flash("notice")
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Server error")
    }
}

/* *****************************
 * Deliver Account Management View
 * ***************************** */
async function buildAccountManagement(req, res) {
    const nav = await utilities.getNav()
    const acc = res.locals.account
    const fullName = `${acc.account_firstname} ${acc.account_lastname}`
    try {
        res.render("account/accountManagement", {
            title: "Account Management",
            nav,
            errors: null,
            notice: req.flash("notice"),
            account: acc,
            fullName
        })

    }   catch (error) {
        console.error("Error loading account management view:", error)
        res.status(500).send("Server error")
    }
}

/* Build update view */
async function buildUpdateView(req, res) {
    const nav = await utilities.getNav()
    const account_id = parseInt(req.params.account_id)
    const account = await accountModel.getAccountById(account_id)
    res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        notice: req.flash("notice"),
        account_id: account.account_id,
        account_firstname: account.account_firstname,
        account_lastname: account.account_lastname,
        account_email: account.account_email



    })
}

/* Update account */
async function updateAccount(req, res) {
    const nav = await utilities.getNav()
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    const result = await accountModel.updateAccountInfo(
        parseInt(account_id),
        account_firstname,
        account_lastname,
        account_email
    )
    if (result) {
        req.flash("notice", "Account information updated.")
        const account = await accountModel.getAccountById(parseInt(account_id))
        return res.render("account/accountManagement", {
            title: "Account Management",
            nav,
            errors: null,
            notice: req.flash("notice"),
            account,
            fullName: `${account.account_firstname} ${account.account_lastname}`
        })
    }   else {
        req.flash("notice", "Update failed. Please correct and try again.")
        return res.status(400).render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            notice: req.flash("notice"),
            account_id,
            account_firstname,
            account_lastname,
            account_email
        })
    }
}   

/* Update password */
async function updatePassword(req, res) {
    const nav = await utilities.getNav()
    const { account_id, account_password } = req.body
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(account_password, saltRounds)
    const ok = await accountModel.updatePassword(parseInt(account_id), hashedPassword)
    if (ok) {
        req.flash("notice", "Password updated.")
    } else {
        req.flash("notice", "Password update failed.")
    }
    const account = await accountModel.getAccountById(parseInt(account_id))
    return res.render("account/accountManagement", {
        title: "Account Management",
        nav,
        errors: null,
        notice: req.flash("notice"),
        account,
        fullName: `${account.account_firstname} ${account.account_lastname}`
    })
}

/* Logout: clear JWT cookie and redirect home */
async function logout(req, res) {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "lax" })
    req.flash("notice", "You have been logged out.")
    res.redirect("/")
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateView, updateAccount,updatePassword, logout }
