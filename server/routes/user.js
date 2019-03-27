const bcrypt = require("bcrypt")
const validators = require("../validators")

module.exports = async function(fastify, options) {
    const db = fastify.mysql
    const config = fastify.config
    const errors = fastify.errors
    const err = fastify.error

    fastify.get("/", async req => {
        try {
            const [rows] = await db.execute(
                "SELECT userid, name, created_at FROM users ORDER BY created_at DESC LIMIT 10"
            )
            return {
                users: rows,
            }
        } catch (e) {
            fastify.log.error(e)
            return err(500)
        }
    })

    fastify.get("/:id", async req => {
        const id = req.params.id
        let query = "SELECT userid, name, created_at FROM users WHERE "
        if (Number(id)) {
            query += "userid = ?"
        } else {
            query += "name = ?"
        }

        let row
        try {
            ;[[[row]], [posts], [comments], [favorites]] = await Promise.all([
                db.execute(query, [id]),
                getUserPosts(id, 5),
                getUserComments(id, 5),
                getUserFavorite(id, 5),
            ])
        } catch (e) {
            fastify.log.error(e)
            return err(500)
        }

        if (row) {
            Object.assign(row, { posts, comments, favorites })
            return {
                user: row,
            }
        } else {
            return err(errors.fu_user_not_found)
        }
    })

    fastify.get("/:id/posts", async req => {
        try {
            const posts = await getUserPosts(id, 10)
            return { posts }
        } catch (e) {
            fastify.log.error(e)
            return err(500)
        }
    })

    fastify.get("/:id/comments", async req => {
        try {
            const [comments] = await getUserComments(req.params.id, 15)
            return {
                comments,
            }
        } catch (e) {
            fastify.log.error(e)
            return err(500)
        }
    })

    fastify.get("/:id/favorites", async req => {
        try {
            const [favorites] = await getUserFavorite(req.params.id, 15)
            return {
                favorites,
            }
        } catch (e) {
            fastify.log.error(e)
            return err(500)
        }
    })

    fastify.post("/new", async req => {
        let { name, password } = req.body
        if (name && password) {
            if (
                validators.isValidUsername(name) &&
                validators.isValidPassword(password)
            ) {
                name = name.toLowerCase()
                password = bcrypt.hash(password, config.password_rounds)

                try {
                    const [info] = await db.execute(
                        "INSERT INTO users (name, password) VALUES (?, ?)",
                        [name, password]
                    )
                    return {
                        msg: `User ${name} successfully created.`,
                        jwt: fastify.createJWT(info.insertId, name),
                        user: {
                            id: info.insertId,
                            name,
                        },
                    }
                } catch (e) {
                    if (e.errno === 1062) {
                        return err(errors.uc_username_taken)
                    } else {
                        fastify.log.error(e)
                        return err(500)
                    }
                }
            } else {
                return err(errors.uc_information_invalid)
            }
        } else {
            return err(errors.uc_information_missing)
        }
    })

    fastify.post("/login", async req => {
        const { name, password } = req.body
        if (name && password) {
            let row
            try {
                ;[[row]] = await db.execute(
                    "SELECT userid, password FROM users WHERE name = ?",
                    [name]
                )
            } catch (e) {
                fastify.log.error(e)
                return err(500)
            }
            if (row) {
                if (bcrypt.compareSync(password, row.password.toString())) {
                    return {
                        msg: `User ${name} successfully logged in.`,
                        jwt: fastify.createJWT(row.userid, name),
                        user: {
                            id: row.userid,
                            name,
                        },
                    }
                } else {
                    return err(errors.ul_user_not_found)
                }
            } else {
                return err(errors.ul_user_not_found)
            }
        } else {
            return err(errors.ul_information_missing)
        }
    })

    fastify.post(
        "/edit",
        {
            preHandler: fastify.requireAuth,
        },
        async req => {
            const { old_password, new_password } = req.body
            if (old_password && new_password) {
                if (
                    validators.isValidPassword(new_password) &&
                    old_password !== new_password
                ) {
                    try {
                        const [[user]] = await db.execute(
                            "SELECT password FROM users WHERE userid = ?",
                            [req.user.id]
                        )

                        if (
                            bcrypt.compareSync(
                                old_password,
                                user.password.toString()
                            )
                        ) {
                            try {
                                const [info] = await db.execute(
                                    "UPDATE users SET password = ? WHERE userid = ?",
                                    [
                                        await bcrypt.hash(
                                            new_password,
                                            config.password_rounds
                                        ),
                                        req.user.id,
                                    ]
                                )
                                return {
                                    password_changed: true,
                                }
                            } catch (e) {
                                fastify.log.error(e)
                                return err(500)
                            }
                        } else {
                            return err(errors.ul_wrong_password)
                        }
                    } catch (e) {
                        fastify.log.error(e)
                        return err(500)
                    }
                } else {
                    return err(errors.uc_information_invalid)
                }
            } else {
                return err(errors.ul_information_missing)
            }
        }
    )

    async function getUserFavorite(id, limit) {
        let query =
            "SELECT votes.type, users.name, posts.* FROM votes JOIN users ON votes.userid JOIN posts ON votes.postid = posts.postid WHERE "

        if (Number(id)) {
            query += "votes.userid = ? "
        } else {
            query += "users.name = ? "
        }

        if (limit) {
            query += "LIMIT " + limit
        }

        return await db.execute(query, [id])
    }

    async function getUserComments(id, limit) {
        let query =
            "SELECT comments.*, users.name FROM comments JOIN users ON comments.userid WHERE "
        if (Number(id)) {
            query += "comments.userid = ? "
        } else {
            query += "users.name = ? "
        }

        if (limit) {
            query += "LIMIT " + limit
        }

        return await db.execute(query, [id])
    }

    async function getUserPosts(id, limit) {
        let query =
            "SELECT posts.*, users.name FROM posts JOIN users ON posts.userid = users.userid WHERE "

        if (Number(id)) {
            query += "posts.userid = ? "
        } else {
            query += "users.name = ? "
        }

        if (limit) {
            query += "LIMIT " + limit
        }

        return await db.execute(query, [id])
    }
}
