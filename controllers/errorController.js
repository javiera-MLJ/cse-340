// controllers/errorController.js

const throw500 = async (req, res, next) => {
    throw new Error("Error 500 intencional generado para pruebas")
}

module.exports = { throw500 }