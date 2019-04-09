import axios from "../axios"
const jsCookie = process.client ? require("js-cookie") : undefined

export default {
    state() {
        return {
            error: null,
            lastAuthType: "",
            jwt: "",
            id: 0,
            name: "",
        }
    },
    mutations: {
        login(state, data) {
            state.jwt = data.token
            state.id = data.user.id
            state.name = data.user.name
        },
        logout(state, data) {
            state.jwt = ""
            state.id = 0
            state.name = ""
        },
        setLastAuthType(state, type) {
            state.lastAuthType = type
        },
        setError(state, error) {
            state.error = error
        },
        clearError(state) {
            state.error = null
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
    commit("setLastAuthType", type)
    const { data } = await axios.post(`user/${type}`, payload)
    if (!data.error) {
        jsCookie.set("auth", data.token)
        axios.setToken(data.token)
        commit("login", data)
    } else {
        console.log(data)
        commit("setError", data)
    }
}
