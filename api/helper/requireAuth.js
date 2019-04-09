const token = require("./token")
const errors = require("../../errors")

module.exports = function(req, res, next) {
    let authorization = req.headers.authorization
    if (authorization) {
        if (authorization.startsWith("Bearer")) {
            authorization = authorization.split(" ")[1]
        }

        claim = token.verify(authorization)
        if (claim) {
            req.user = claim
            next()
        } else {
            res.send(errors.fu_token_invalid)
        }
    } else {
        res.send(errors.fu_token_required)
    }
}
