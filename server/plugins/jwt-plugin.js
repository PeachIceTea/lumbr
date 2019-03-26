const config = require("../config")
const errors = require("../errors")
const fastifyPlugin = require("fastify-plugin")
const jwt = require("jsonwebtoken")

async function jwtPlugin(fastify, options) {
    fastify.decorate("createJWT", function(id, name) {
        return jwt.sign({ id, name }, config.secret, {
            expiresIn: config.token_expiration,
        })
    })

    fastify.decorate("requireAuth", function(req, res, next) {
        console.log(req.headers)
        let { authorization } = req.headers
        if (authorization) {
            if (authorization && authorization.startsWith("Bearer")) {
                authorization = authorization.split(" ")[1]
            }

            try {
                const payload = jwt.verify(authorization, config.secret)
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
    })
}

module.exports = fastifyPlugin(jwtPlugin)
