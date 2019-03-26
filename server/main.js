const config = require("./config")
const fastify = require("fastify")({
    logger: {
        prettyPrint: true,
    },
})

fastify.register(require("./plugins/database-connector"))
fastify.register(require("./plugins/create-token"))

fastify.decorate("config", config)
fastify.decorate("errors", require("./errors"))

fastify.register(require("./routes"))

fastify.listen(config.port, function(err, address) {
    if (err) throw err
})
