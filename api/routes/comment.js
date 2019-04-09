const errors = require("../../errors")
const post = require("../model/post")
const requireAuth = require("../helper/requireAuth")
const validators = require("../../validators")

const Post = require("../model/post")
const Comment = require("../model/comment")

module.exports = async function(fastify, options) {
    fastify.get("/:id/comment", async req => {
        const id = Number(req.params.id)
        if (id) {
            return await Comment.getForPost(id)
        } else {
            return errors.fp_id_invalid
        }
    })

    fastify.post("/:id/comment/new", { preHandler: requireAuth }, async req => {
        const id = Number(req.params.id),
            content = req.body.content
        if (id) {
            if (validators.isValidComment(content)) {
                return await Comment.new(req.user, id, content)
            } else {
                return errors.fp_invalid_comment
            }
        } else {
            return errors.fp_id_invalid
        }
    })
}
