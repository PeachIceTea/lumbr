const bcrypt = require("bcrypt")
const validators = require("../validators")

module.exports = async function(fastify, options) {
    const db = fastify.mysql
    const config = fastify.config
    const errors = fastify.errors

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
            return {
                error: {
                    errno: errors.internal_server_error,
                    msg: "Internal server error.",
                },
            }
        }
    })

    fastify.get("/:id", async req => {
        const id = req.params.id
        if (id) {
            if (parseInt(id)) {
                let row
                try {
                    ;[[row]] = await db.execute(
                        "SELECT userid, name, created_at FROM users WHERE userid = ?",
                        [id]
                    )
                } catch (e) {
                    fastify.log.error(e)
                    return {
                        error: {
                            errno: errors.internal_server_error,
                            msg: "Internal server error.",
                        },
                    }
                }

                if (row) {
                    return {
                        user: row,
                    }
                } else {
                    return {
                        error: {
                            errno: errors.fu_userid_not_found,
                            msg: `User with id ${id} not found`,
                        },
                    }
                }
            } else {
                let row
                try {
                    ;[[row]] = await db.execute(
                        "SELECT userid, name, created_at FROM users WHERE name = ?",
                        [id]
                    )
                } catch (e) {
                    return {
                        error: {
                            errno: errors.fu_userid_not_found,
                            msg: `User with id ${id} not found`,
                        },
                    }
                }

                if (row) {
                    return {
                        user: row,
                    }
                } else {
                    return {
                        error: {
                            errno: fu_username_not_found,
                            msg: `User ${id} not found`,
                        },
                    }
                }
            }
        } else {
            return {
                error: {
                    errno: errors.fu_information_missing,
                    msg: "Information missing",
                },
            }
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
                password = bcrypt.hashSync(password, config.password_rounds)

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
                        return {
                            error: {
                                errno: errors.uc_username_taken,
                                msg: `Username ${name} is taken.`,
                            },
                        }
                    } else {
                        fastify.log.error(e)
                        return {
                            error: {
                                errno: errors.internal_server_error,
                                msg: "Internal server error.",
                            },
                        }
                    }
                }
            } else {
                return {
                    error: {
                        errno: errors.uc_information_invalid,
                        msg: "Information invalid",
                    },
                }
            }
        } else {
            return {
                error: {
                    errno: errors.uc_information_missing,
                    msg: "Information missing.",
                },
            }
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
                return {
                    error: {
                        errno: errors.internal_server_error,
                        msg: "Internal server error.",
                    },
                }
            }
            if (row) {
                if (bcrypt.compareSync(password, row.password.toString())) {
                    return {
                        msg: `User ${name} successfully logged in.`,
                        jwt: fastify.createJWT(row.userid, name),
                        user: {
                            id: info.insertId,
                            name,
                        },
                    }
                } else {
                    return {
                        error: {
                            errno: errors.ul_wrong_password,
                            msg: "Passwords do not match.",
                        },
                    }
                }
            } else {
                return {
                    error: {
                        errno: errors.ul_user_not_found,
                        msg: `Cannot find user ${name}`,
                    },
                }
            }
        } else {
            return {
                error: {
                    errno: errors.ul_information_missing,
                    msg: "Information missing.",
                },
            }
        }
    })
}
