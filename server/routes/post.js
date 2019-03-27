const fs = require("fs")
const concat = require("concat-stream")
const sharp = require("sharp")
const nano = require("nanoid")

const accepted_mime = ["image/png", "image/jpeg"]

const original = sharp().jpeg({ quality: 100 })
const resized = sharp()
    .resize(1280, 1280, { fit: "inside" })
    .jpeg({ quality: 100 })
const thump = sharp()
    .resize(400, 400)
    .jpeg({ quality: 100 })

module.exports = async function(fastify, options) {
    const db = fastify.mysql
    const config = fastify.config
    const errors = fastify.errors
    const err = fastify.error

    fastify.get("/", async req => {
        try {
            const [rows] = await db.execute(
                "SELECT posts.*, users.name FROM posts JOIN users ON posts.userid = users.userid LIMIT 30"
            )

            return {
                posts: rows,
            }
        } catch (e) {
            fastify.log.error(e)
            return err(500)
        }
    })

    fastify.get("/:id", async req => {
        const id = req.params.id
        if (Number(id)) {
            try {
                const [[[row]], [comments]] = await Promise.all([
                    db.execute("SELECT * FROM posts WHERE postid = ?", [id]),
                    getCommentsForPost(id),
                ])

                if (row) {
                    row.comments = comments
                    return {
                        post: row,
                    }
                } else {
                    return err(errors.iv_post_not_found)
                }
            } catch (e) {
                fastify.log.error(e)
                return err(500)
            }
        } else {
            return err(errors.iv_id_invalid)
        }
    })

    const voteEnum = ["favorite", "up", "down"]
    fastify.post(
        "/:id/vote",
        {
            preHandler: fastify.requireAuth,
        },
        async req => {
            const id = req.params.id,
                type = req.body.type
            if (Number(id)) {
                if (type && voteEnum.includes(type)) {
                    try {
                        const [info] = await db.execute(
                            "INSERT INTO votes (type, postid, userid) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE type = ?",
                            [type, id, req.user.id, type]
                        )

                        return {
                            id: info.insertId,
                            type,
                        }
                    } catch (e) {
                        fastify.log.error(e)
                        return err(500)
                    }
                } else {
                    return err(errors.pc_type_missing)
                }
            } else {
                return err(errors.iv_id_invalid)
            }
        }
    )

    fastify.post(
        "/new",
        {
            preHandler: fastify.requireAuth,
        },
        (req, res) => {
            let errno = 0,
                image
            const body = {}
            const mp = req.multipart(handler, async err => {
                if (!err) {
                    const id = nano(10)
                    try {
                        await Promise.all([
                            image
                                .jpeg({ quality: 100 })
                                .toFile(`./uploads/originals/${id}.jpg`),

                            image
                                .resize(1280, 1280, { fit: "outside" })
                                .toFile(`./uploads/resized/${id}.jpg`),

                            image
                                .resize(400, 400, { fit: "cover" })
                                .toFile(`./uploads/thumbs/${id}.jpg`),
                        ])
                    } catch (e) {
                        return res.send(err(errors.iu_file_handling_error))
                    }

                    try {
                        const [info] = await db.execute(
                            "INSERT INTO posts (filename, userid) VALUES (?, ?)",
                            [id, req.user.id]
                        )

                        res.send({
                            id: info.insertId,
                            fileid: id,
                        })
                    } catch (e) {
                        fastify.log.error(e)
                        return err(500)
                    }
                } else {
                    res.send(err(errno))
                }
            })

            mp.on("filesLimit", () => (errno = errors.iu_too_many_files))
            mp.on("fieldsLimit", () => (errno = errors.iu_too_many_fields))
            mp.on("field", (key, value) => (body[key] = value))
            function handler(field, file, filename, encoding, mimetype) {
                if (field === "image") {
                    file.pipe(
                        concat(buf => {
                            image = sharp(buf)
                        })
                    )
                } else {
                    errno = errors.iu_no_image
                    file.destroy()
                }
                file.on("limit", () => (errno = errors.iu_file_too_large))
            }
        }
    )

    // Comments
    fastify.get("/:id/comment", async req => {
        const id = req.params.id
        if (Number(id)) {
            try {
                const [comments] = await getCommentsForPost(id)
                return {
                    comments,
                }
            } catch (e) {
                fastify.log.error(e)
                return err(500)
            }
        } else {
            return err(iv_id_invalid)
        }
    })

    fastify.get("/:id/comment/:cid", async req => {
        const { id, cid } = req.params
        if (Number(id) && Number(cid)) {
            try {
                const [[comment]] = await db.execute(
                    "SELECT comments.*, users.name FROM comments JOIN users ON comments.userid = users.userid WHERE comments.postid = ? ORDER BY comments.commentid LIMIT 1 OFFSET ?",
                    [id, cid - 1]
                )

                return {
                    comment,
                }
            } catch (e) {
                fastify.log.error(e)
                return err(500)
            }
        } else {
            return err(iv_id_invalid) //TODO create a better errcode maybe
        }
    })

    fastify.post(
        "/:id/comment/new",
        {
            preHandler: fastify.requireAuth,
        },
        async req => {
            const id = req.params.id
            if (Number(id)) {
                const { content } = req.body
                if (content) {
                    try {
                        const [info] = await db.execute(
                            "INSERT INTO comments (content, postid, userid) VALUES (?, ?, ?)",
                            [content, id, req.user.id]
                        )
                        return {
                            id: info.insertId,
                        }
                    } catch (e) {
                        fastify.log.error(e)
                        return err(500)
                    }
                } else {
                    return err(errors.pc_content_missing)
                }
            } else {
                return err(iv_id_invalid)
            }
        }
    )

    async function getCommentsForPost(id, limit) {
        let query =
            "SELECT comments.*, users.name FROM comments JOIN users ON comments.userid = users.userid WHERE comments.postid = ?"

        if (limit) {
            query += " LIMIT " + limit
        }

        return await db.execute(query, [id])
    }
}

function handleError(e) {
    console.error(e)
}
