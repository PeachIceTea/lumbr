module.exports = async function(fastify, options) {
    fastify.register(require("./user"), { prefix: "/user" })
    fastify.register(require("./post"), { prefix: "/post" })

    fastify.setNotFoundHandler((req, res) => {
        res.status(200).send(fastify.error(404))
    })

    fastify.setErrorHandler((e, req, res) => {
        if (e.statusCode !== 500) {
            res.send(fastify.error(e.statusCode))
        } else {
            fastify.log.fatal(e.statusCode)
            res.send(fastify.error(500))
        }
    })
}
