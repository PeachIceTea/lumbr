import axios from "~/plugins/axios"

export default {
    state() {
        return {
            auth: {},
            user: {},
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setAuth(state, auth) {
            state.auth = auth
        },
    },
    actions: {
        async getUser({ commit }, id) {
            const { data } = await axios.get(`user/${id}`)
            if (!data.errno) {
                commit("setUser", data.user)
            } else {
                throw data
            }
        },
        async register({ commit }, payload) {
            const { data } = await axios.post(`user/new`, payload)
            if (!data.errno) {
                commit("setAuth", data)
            } else {
                throw data
            }
        },
        async login({ commit }, payload) {
            const { data } = await axios.post(`user/login`, payload)
            if (!data.errno) {
                commit("setAuth", data)
            } else {
                throw data
            }
        },
    },
}
