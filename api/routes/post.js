const errors = require("../../errors")
const Post = require("../model/post")
const requireAuth = require("../helper/requireAuth")
const handleImageUpload = require("../helper/handleImageUpload")

module.exports = async function(fastify, options) {
    fastify.get("/", async req => {
        return await Post.getPage(0)
    })

    fastify.get("/page/:id", async req => {
        const id = Number(req.params.id)
        if (!isNaN(id)) {
            return await Post.getPage(id)
        } else {
            return errors.fp_id_invalid
        }
    })

    fastify.get("/:id", async req => {
        const id = Number(req.params.id)
        if (id) {
            return await Post.get(id)
        } else {
            return errors.fp_id_invalid
        }
    })

    fastify.post("/new", { preHandler: requireAuth }, handleImageUpload)
    fastify.register(require("./comment"))
}
