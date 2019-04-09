import axios from "../axios"

const cookieparser = process.server ? require("cookieparser") : undefined
const jsCookie = process.client ? require("js-cookie") : undefined

export default {
    actions: {
        async nuxtServerInit({ commit }, { req }) {
            axios.removeToken()

            if (req.headers.cookie) {
                const parsed = cookieparser.parse(req.headers.cookie)
                if (parsed.auth) {
                    axios.setToken(parsed.auth)
                    const { data } = await axios.get("user/auth")
                    if (!data.error) {
                        commit("auth/login", { token: parsed.auth, user: data })
                    } else {
                        commit("auth/setError", "Could not confirm token")
                    }
                }
            }
        },
        nuxtClientInit({ state, commit }) {
            if (state.auth.error) {
                jsCookie.remove(auth)
                commit("auth/clearError")
            }

            if (state.auth.jwt) {
                axios.setToken(state.auth.jwt)
            }
        },
    },
}
