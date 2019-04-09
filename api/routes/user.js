const errors = require("../../errors")
const User = require("../model/user")
const { isValidUsername, isValidPassword } = require("../../validators")
const jwt = require("../helper/token")
const requireAuth = require("../helper/requireAuth")

module.exports = async function(fastify, options) {
    // Auth
    fastify.post("/new", async req => {
        const { name, password } = req.body

        if (name && password) {
            if (isValidUsername(name) && isValidPassword(password)) {
                const user = await User.new(name, password)
                if (!user.error) {
                    return {
                        user,
                        token: jwt.get({ id: user.id, name: user.name }),
                    }
                } else {
                    return user
                }
            } else {
                return errors.uc_data_invalid
            }
        } else {
            return errors.uc_data_missing
        }
    })

    fastify.post("/login", async req => {
        const { name, password } = req.body
        if (name && password) {
            const user = await User.login(name, password)
            if (!user.error) {
                return {
                    user,
                    token: jwt.get({ id: user.id, name: user.name }),
                }
            } else {
                return user
            }
        } else {
            return errors.uc_data_missing
        }
    })

    fastify.post("/edit", { preHandler: requireAuth }, async req => {
        const { old_password, new_password } = req.body
        if (old_password && new_password) {
            if (isValidPassword(new_password)) {
                return User.changePassword(
                    req.user.id,
                    old_password,
                    new_password
                )
            } else {
                return errors.uc_data_invalid
            }
        } else {
            return errors.fu_data_missing
        }
    })

    fastify.get("/auth", { preHandler: requireAuth }, async req => {
        return req.user
    })

    // Order is important here. /auth has to be matched before /:id
    fastify.get("/:id", async req => {
        const id = Number(req.params.id)
        if (id) {
            return await User.get(id, { getAll: true })
        } else {
            return errors.fu_id_invalid
        }
    })
}
