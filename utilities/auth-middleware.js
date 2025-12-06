const jwt = require("jsonwebtoken")

function requireAuth(req, res, next) {
    try {
        const token = req.cookies?.jwt
        if (!token) {
            req.flash("notice", "Please log in to continue.")
            return res.redirect("/account/login")
        }
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        res.locals.account = payload 
        next()
    } catch (err) {
        req.flash("notice", "Session expired or invalid. Please log in.")
        return res.redirect("/account/login")
    }
}

function requireRole(roles = []) {
    return (req, res, next) => {
        const type = res.locals.account?.account_type
        if (!type || !roles.includes(type)) {
            req.flash("notice", "Insufficient privileges.")
            return res.redirect("/account/login")
        }
        next()
    }
}

module.exports = { requireAuth, requireRole }
