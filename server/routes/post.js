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

    fastify.get("/", async req => {
        const [rows] = await db.execute(
            "SELECT posts.*, users.name FROM posts JOIN users ON posts.userid = users.userid LIMIT 30"
        )

        return {
            posts: rows,
        }
    })

    fastify.post(
        "/new",
        {
            preHandler: fastify.requireAuth,
        },
        (req, res) => {
            let err = 0,
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
                        return res.send({
                            error: {
                                errno: errors.iu_file_handling_error,
                                msg:
                                    "Error handling the uploaded file. Please make sure it is an image.",
                            },
                        })
                    }

                    const [info] = await db.execute(
                        "INSERT INTO posts (filename, userid) VALUES (?, ?)",
                        [id, req.user.id]
                    )

                    res.send({
                        id: info.insertId,
                    })
                } else {
                    res.send({
                        error: {
                            errno: err,
                        },
                    })
                }
            })

            mp.on("filesLimit", () => (err = errors.iu_too_many_files))
            mp.on("fieldsLimit", () => (err = errors.iu_too_many_fields))
            mp.on("field", (key, value) => (body[key] = value))
            function handler(field, file, filename, encoding, mimetype) {
                if (field === "image") {
                    file.pipe(
                        concat(buf => {
                            image = sharp(buf)
                        })
                    )
                } else {
                    err = errors.iu_no_image
                    file.destroy()
                }
                file.on("limit", () => (err = errors.iu_file_too_large))
            }
        }
    )
}

function handleError(e) {
    console.error(e)
}

/*let ji
                try {
                    ji = await jimp.read(image)
                } catch (e) {
                    return res.send({
                        error: {},
                    })
                }

                ji.writeAsync(`./uploads/original/${id}.png`)
                ji.scaleToFit(1280, 720).writeAsync(
                    `./uploads/resized/${id}.png`
                )
                ji.cover(300, 300).writeAsync(`./uploads/thumbs/${id}.png`)
 */
