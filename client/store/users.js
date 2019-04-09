import axios from "../axios"

export default {
    state() {
        return {
            user: {},
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
    },
    actions: {
        async getUser({ commit }, id) {
            const { data } = await axios.get(`user/${id}`)
            if (!data.errno) {
                commit("setUser", data)
            } else {
                throw data
            }
        },
    },
}
