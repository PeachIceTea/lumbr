const db = require("../db")
const errors = require("../../errors")
const config = require("../../config")

class Post {
    constructor(obj) {
        this._obj = obj
    }

    async getComments() {
        this._obj.comments = await Comment.getForPost(this._obj.id)
        return this._obj.comments
    }
}

Post.prototype.toJSON = function() {
    return this._obj
}

const post = {
    _getSelectQuery({
        queryOne = false,
        limit = config.posts_per_page,
        offset = 0,
        user = "",
    }) {
        return `SELECT post.*, user.name AS username,
        0 AS score,
        (SELECT COUNT(1) FROM comment WHERE comment.id = post.id) AS comment_count
        FROM post
        JOIN user ON post.user_id = user.id
        ${user ? " WHERE user.id = ?" : ""}
        ${
            queryOne
                ? "WHERE post.id = ?"
                : `ORDER BY post.id DESC
                LIMIT ${limit}
                OFFSET ${offset * limit}`
        }`
    },
    async get(id) {
        let post = await db.queryOne(this._getSelectQuery({ queryOne: true }), [
            id,
        ])
        if (post) {
            post = new Post(post)
            await post.getComments()
            return post
        } else {
            return errors.fp_post_not_found
        }
    },
    async getPage(offset) {
        return await db.queryMany(this._getSelectQuery({ offset }))
    },
    async getForUser(user, offset) {
        return await db.queryMany(
            this._getSelectQuery({ offset, limit: 5, user: user.id }),
            [user.id]
        )
    },
    async new(user, filename, options = { returnPost: true }) {
        const info = await db.queryInfo(
            "INSERT INTO post (user_id, filename) VALUES (?, ?)",
            [user.id, filename]
        )
        if (options.returnPost) {
            return this.get(info.insertId)
        } else {
            return { id: info.insertId }
        }
    },
}

module.exports = post

// Models have to require each other after module.exports to allow for circular requires
const Comment = require("./comment")
