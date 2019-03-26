const config = require("../config")
const fastifyPlugin = require("fastify-plugin")
const jwt = require("jsonwebtoken")

async function createToken(fastify, options) {
    fastify.decorate("createJWT", function(id, name) {
        return jwt.sign({ id, name }, config.secret, {
            expiresIn: config.token_expiration,
        })
    })
}

module.exports = fastifyPlugin(createToken)
