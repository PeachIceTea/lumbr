import axios from "~/plugins/axios"
const jsCookie = process.client ? require("js-cookie") : undefined

export default {
    state() {
        return {
            jwt: "",
            user: {},
        }
    },
    mutations: {
        setUser(state, auth) {
            state.user = auth.user
        },
        setJWT(state, jwt) {
            state.jwt = jwt
        },
        logout(state) {
            state.jwt = ""
            state.user = {}
        },
    },
    actions: {
        async register({ commit }, payload) {
            await auth(commit, "new", payload)
        },
        async login({ commit }, payload) {
            await auth(commit, "login", payload)
        },
        async logout({ commit }) {
            jsCookie.remove("auth")
            axios.removeToken()
            commit("logout")
        },
    },
}

async function auth(commit, type, payload) {
    const { data } = await axios.post(`user/${type}`, payload)
    if (!data.errno) {
        jsCookie.set("auth", data.jwt)
        axios.setToken(data.jwt)
        commit("setJWT", data.jwt)
        commit("setUser", data)
    } else {
        throw data
    }
}
