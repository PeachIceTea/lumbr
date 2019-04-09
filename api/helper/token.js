const jwt = require("jsonwebtoken")
const { secret } = require("../../config")

module.exports = {
    get(claim) {
        return jwt.sign(claim, secret, {
            expiresIn: "3days",
        })
    },
    verify(token) {
        try {
            return jwt.verify(token, secret)
        } catch (e) {
            return false
        }
    },
}
