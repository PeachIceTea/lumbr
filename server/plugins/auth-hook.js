const config = require("../config")
const errors = require("../errors")
const jwt = require("jsonwebtoken")

module.exports = function(req, res, next) {
    let { Authorization } = req.headers
    if (Authorization) {
        if (Authorization && Authorization.startsWith("Bearer")) {
            Authorization = Authorization.split(" ")[1]
        }

        try {
            const payload = jwt.verify(Authorization, config.secret)
            req.user = payload
            next()
        } catch (e) {
            res.send({
                error: {
                    errno: errors.auth_token_invalid,
                    msg: "Provided token is invalid.",
                },
            })
        }
    } else {
        res.send({
            error: {
                errno: errors.auth_token_missing,
                msg:
                    "A token is required for this route, but none was provided.",
            },
        })
    }
}
