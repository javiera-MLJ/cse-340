const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

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

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
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
*  Process Login
* *************************************** */
async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash("notice", "Email not found.")
        return res.redirect("/account/login")
    }

    const passwordMatch = account_password === accountData.account_password

    if (!passwordMatch) {
        req.flash("notice", "Incorrect password.")
        return res.redirect("/account/login")
    }

    req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
    return res.render("account/account", {
        title: "Account",
        nav,
        accountData,
    })
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount }
