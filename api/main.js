const config = require("../config")
const path = require("path")
const fastify = require("fastify")({
    logger: {
        prettyPrint: true,
    },
    ignoreTrailingSlash: true,
})

fastify.register(require("fastify-cors"), {
    origin: "*",
})

fastify.register(require("fastify-multipart"), {
    files: 1,
    fileSize: 50000000,
    fields: 5,
})

fastify.register(require("fastify-static"), {
    root: path.resolve(__dirname, "../uploads"),
    prefix: "/uploads",
})

fastify.register(require("./routes"))

fastify.listen(config.api.port, "0.0.0.0", err => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})
