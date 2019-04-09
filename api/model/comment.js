const db = require("../db")
const errors = require("../../errors")
const config = require("../../config")

const comment = {
    _getSelectQuery(queryOne) {
        return `SELECT comment.*, user.name AS username FROM comment JOIN user ON comment.user_id = user.id WHERE ${
            queryOne ? "comment.id = ?" : "comment.post_id = ?"
        }`
    },
    async getForPost(postId) {
        return await db.queryMany(this._getSelectQuery(false), [postId])
    },
    async get(id) {
        const comment = await db.queryOne(this._getSelectQuery(true), [id])
        if (comment) {
            return comment
        } else {
            return errors.fp_comment_not_found
        }
    },
    async new(user, postId, content, options = { returnComment: true }) {
        const post = await Post.get(postId)
        if (!post.error) {
            const info = await db.queryInfo(
                "INSERT INTO comment (user_id, post_id, content) VALUES (?, ?, ?)",
                [user.id, postId, content]
            )
            if (options.returnComment) {
                return this.get(info.insertId)
            } else {
                return { id: info.insertId }
            }
        } else {
            return post
        }
    },
    async edit() {},
}

module.exports = comment

// Models have to require each other after module.exports to allow for circular requires
const Post = require("./post")
