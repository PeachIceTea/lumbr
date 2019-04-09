const db = require("../db")
const errors = require("../../errors")
const bcrypt = require("bcrypt")
const config = require("../../config")

class User {
    constructor(obj) {
        this._obj = obj
    }

    async getAll() {
        await Promise.all([this.getPosts()])
    }

    async getPosts(page = 0) {
        this._obj.posts = await Post.getForUser(this._obj, page)
        return this._obj.posts
    }
}

User.prototype.toJSON = function() {
    return this._obj
}

const user = {
    // Get
    async get(id, options = { password: false, getAll: false }) {
        let user = await db.queryOne(
            `SELECT ${
                options.password ? "*" : "id, name, created_at, updated_at"
            } FROM user WHERE ${
                typeof id === "string" ? "name = ?" : "id = ?"
            }`,
            [id]
        )
        if (user) {
            if (options.getAll) {
                user = new User(user)
                await user.getAll()
            }
            return user
        } else {
            return errors.fu_user_not_found
        }
    },

    // Auth
    async new(name, password, options = { returnUser: true }) {
        name = name.toLowerCase()
        if (await this.isUnique(name)) {
            password = await bcrypt.hash(password, config.password_rounds)
            const info = await db.queryInfo(
                "INSERT INTO user (name, password) VALUES (?, ?)",
                [name, password]
            )
            if (options.returnUser) {
                return await this.get(info.insertId)
            } else {
                return { id: info.insertId }
            }
        } else {
            return errors.uc_username_taken
        }
    },
    async login(name, password) {
        name = name.toLowerCase()
        const user = await this.get(name, { password: true })
        if (!user.error) {
            if (await bcrypt.compare(password, user.password.toString())) {
                user.password = undefined
                return user
            } else {
                return errors.fu_password_doesnt_match
            }
        } else {
            return user
        }
    },
    async changePassword(id, oldPassword, newPassword) {
        const user = await this.get(id, { password: true })
        if (await bcrypt.compare(oldPassword, user.password.toString())) {
            db.queryInfo("UPDATE user SET password = ? WHERE id = ?", [
                await bcrypt.hash(newPassword, config.password_rounds),
                id,
            ])
            return user
        } else {
            return errors.fu_password_doesnt_match
        }
    },
    async isUnique(name) {
        return !(await db.queryOne("SELECT 1 FROM user WHERE name = ?", [name]))
    },
}

module.exports = user

const Post = require("./post")
