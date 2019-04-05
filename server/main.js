const config = require("../shared/config")
const path = require("path")
const fastify = require("fastify")({
    ignoreTrailingSlash: true,
    logger: {
        prettyPrint: true,
    },
})

fastify.register(require("fastify-multipart"), {
    files: 1,
    fileSize: 50000000,
    fields: 5,
})
fastify.register(require("fastify-static"), {
    root: path.resolve(__dirname, "../uploads"),
    prefix: "/uploads",
    decorateReply: false,
})
fastify.register(require("fastify-cors"), {
    origin: "*",
})

fastify.register(require("./plugins/database-connector"))
fastify.register(require("./plugins/response-plugin"))
fastify.register(require("./plugins/jwt-plugin"))

fastify.decorate("config", config)
fastify.decorate("errors", require("./errors"))

fastify.register(require("./routes"))

fastify.listen(config.port, function(err, address) {
    if (err) throw err
})
