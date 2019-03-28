const config = require("./config")

module.exports = {
    isValidUsername(str) {
        const len = str.length
        return (
            len >= config.username_min_length &&
            len <= config.username_max_length &&
            this.isLetter(str.charCodeAt(0)) &&
            this.isAlphanumeric(str)
        )
    },
    isValidPassword(str) {
        const len = str.length
        return len >= config.password_min_length
    },
    isLetter(code) {
        return (code > 64 && code < 91) || (code > 96 && code < 123)
    },
    isAlphanumeric(str) {
        let code
        for (let i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i)
            if (!(code > 47 && code < 58) && !this.isLetter(code)) {
                return false
            }
        }
        return true
    },
}
