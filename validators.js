const config = require("./config").validation

const validators = {
    isLetter(code) {
        return (code > 64 && code < 91) || (code > 96 && code < 123)
    },
    isAlphanumeric(str) {
        let code
        for (let i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i)
            if (!(code > 47 && code < 58) && !validators.isLetter(code)) {
                return false
            }
        }
        return true
    },
    isValidUsername(str) {
        const len = str.length
        return (
            len >= config.username_min_length &&
            len <= config.username_max_length &&
            validators.isLetter(str.charCodeAt(0)) &&
            validators.isAlphanumeric(str)
        )
    },
    isValidPassword(str) {
        return str.length >= config.password_min_length
    },
    isValidComment(str) {
        const len = str.length
        return (
            len >= config.comment_min_length && len <= config.comment_max_length
        )
    },
}

module.exports = validators
