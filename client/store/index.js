import axios from "~/plugins/axios"

const cookieparser = process.server ? require("cookieparser") : undefined

export default {
    actions: {
        async nuxtServerInit({ commit }, { req }) {
            axios.removeToken()

            if (req.headers.cookie) {
                const parsed = cookieparser.parse(req.headers.cookie)
                if (parsed.auth) {
                    axios.setToken(parsed.auth)
                    try {
                        const { data } = await axios.get("user/auth")
                        if (!data.errno) {
                            commit("auth/setUser", data)
                            commit("auth/setJWT", parsed.auth)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        },
        async nuxtClientInit({ state }) {
            if (state.auth.jwt) {
                axios.setToken(state.auth.jwt)
            }
        },
    },
}
