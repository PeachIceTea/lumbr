import Vuex from "vuex"

const cookieparser = process.server ? require("cookieparser") : undefined

export default {
    actions: {
        async nuxtServerInit({ commit }, { req }) {
            if (req.headers.cookie) {
                const parsed = cookieparser.parse(req.headers.cookie)
                if (parsed.auth) {
                    commit("auth/setJWT", parsed.auth)
                }
            }
        },
    },
}
