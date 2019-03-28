const config = require("../../shared/config")
const errors = require("../errors")
const fastifyPlugin = require("fastify-plugin")
const jwt = require("jsonwebtoken")

async function jwtPlugin(fastify, options) {
    const err = fastify.error
    fastify.decorate("createJWT", function(id, name) {
        return jwt.sign({ id, name }, config.secret, {
            expiresIn: config.token_expiration,
        })
    })

    fastify.decorate("requireAuth", function(req, res, next) {
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
                res.send(err(errors.auth_token_invalid))
            }
        } else {
            res.send(err(errors.auth_token_missing))
        }
    })
}

module.exports = fastifyPlugin(jwtPlugin)
