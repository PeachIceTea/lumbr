const fs = require("fs")
const concat = require("concat-stream")
const sharp = require("sharp")
const nano = require("nanoid")
const config = require("../../config")
const errors = require("../../errors")
const Post = require("../model/post")

// TODO: Check MIME and add support for uploading pngs, gifs and most importantly webms
const accepted_mime = []

const original = sharp().jpeg({ quality: 100 })
const resized = sharp()
    .resize(1280, 1280, { fit: "inside" })
    .jpeg({ quality: 100 })
const thump = sharp()
    .resize(400, 400)
    .jpeg({ quality: 100 })

module.exports = (req, res) => {
    if (req.headers["content-type"].startsWith("multipart/form-data")) {
        let errno = 0,
            image
        const body = {}
        function handleImageUpload(field, file, filename, encoding, mimetype) {
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

        async function handleImageSaving(err) {
            if (!err) {
                const id = nano(10)
                try {
                    await Promise.all([
                        image
                            .jpeg({ quality: config.source_jpg_quality })
                            .toFile(`./uploads/originals/${id}.jpg`),

                        image
                            .jpeg({ quality: config.resized_jpg_quality })
                            .resize(1280, 1280, { fit: "outside" })
                            .toFile(`./uploads/resized/${id}.jpg`),

                        image
                            .jpeg({ quality: config.thumb_jpg_quality })
                            .resize(800, 800, { fit: "cover" })
                            .toFile(`./uploads/thumbs/${id}.jpg`),
                    ])
                } catch (e) {
                    return res.send(errors.iu_file_handling_error)
                }

                return res.send(await Post.new(req.user, id))
            } else {
                res.send(errno)
            }
        }

        try {
            const mp = req.multipart(handleImageUpload, handleImageSaving)
            mp.on("filesLimit", () => (errno = errors.iu_too_many_files))
            mp.on("fieldsLimit", () => (errno = errors.iu_too_many_fields))
            mp.on("field", (key, value) => (body[key] = value)) // TODO: This could be used to add tags during upload.
        } catch (e) {
            res.status(400).send(errors.http_bad_request)
        }
    } else {
        res.send(errors.iu_wrong_content_type)
    }
}
