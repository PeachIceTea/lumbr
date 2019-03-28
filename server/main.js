const config = require("../shared/config")
const path = require("path")
const fastify = require("fastify")({
    ignoreTrailingSlash: true,
    logger: {
        prettyPrint: true,
    },
})
const static = require("fastify-static")

fastify.register(require("fastify-multipart"), {
    files: 1,
    fileSize: 50000000,
    fields: 5,
})
fastify.register(static, {
    root: path.resolve(__dirname, "../uploads"),
    prefix: "/uploads",
    decorateReply: false,
})
fastify.register(static, {
    root: path.resolve(__dirname, "../dist"),
    prefix: "/",
})
fastify.register((fastify, opts, next) => {
    fastify.setNotFoundHandler((req, res) => {
        res.status(200).sendFile("index.html")
    })
    next()
})

fastify.register(require("./plugins/database-connector"))
fastify.register(require("./plugins/jwt-plugin"))
fastify.register(require("./plugins/response-plugin"))

fastify.decorate("config", config)
fastify.decorate("errors", require("./errors"))

fastify.register(require("./routes"), { prefix: "/api" })

require("webpack")(require("../webpack.config.js")).run((err, stats) => {
    if (err) {
        console.error(err)
    } else {
        console.log(stats.hasErrors())
        fastify.listen(config.port, function(err, address) {
            if (err) throw err
        })
    }
})
