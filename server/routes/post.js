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
        if (parseInt(req.params.id)) {
            try {
                const [[row]] = await db.execute(
                    "SELECT * FROM posts WHERE postid = ?",
                    [req.params.id]
                )

                if (row) {
                    return { post: row }
                } else {
                    return err(iv_post_not_found)
                }
            } catch (e) {
                fastify.log.error(e)
                return err(500)
            }
        } else {
            return err(iv_id_invalid)
        }
    })

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
                        err(500)
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
}

function handleError(e) {
    console.error(e)
}
