module.exports = async function(fastify, options) {
    fastify.register(require("./user"), { prefix: "/user" })
    fastify.register(require("./post"), { prefix: "/post" })

    fastify.setNotFoundHandler((req, res) => {
        res.send(fastify.error(404))
    })

    fastify.setErrorHandler((e, req, res) => {
        fastify.log.fatal(e)
        res.send(fastify.error(500))
    })
}
