module.exports = async function(fastify, options) {
    fastify.register(require("./user"), { prefix: "/user" })
    fastify.register(require("./post"), { prefix: "/post" })
}
