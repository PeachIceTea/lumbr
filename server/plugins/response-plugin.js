const errors = require("../errors")
const fastifyPlugin = require("fastify-plugin")

async function responsePlugin(fastify, options) {
    fastify.decorate("error", errno => {
        return {
            errno,
            err: errors[errno],
        }
    })
}

module.exports = fastifyPlugin(responsePlugin)
