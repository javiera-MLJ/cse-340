// controllers/errorController.js

const throw500 = async (req, res, next) => {
    throw new Error("Error 500 intentionally generated for testing")
}

module.exports = { throw500 }