import axios from "~/plugins/axios"

export default {
    state() {
        return {
            posts: [],
            post: {},
        }
    },
    mutations: {
        setPosts(state, posts) {
            state.posts = posts
        },
        setPost(state, post) {
            state.post = post
        },
    },
    actions: {
        async getPosts({ commit }) {
            const { data } = await axios.get("post")
            if (!data.errno) {
                commit("setPosts", data.posts)
            } else {
                throw data
            }
        },
        async getPost({ commit }, id) {
            const { data } = await axios.get(`post/${id}`)
            if (!data.errno) {
                commit("setPost", data.post)
            } else {
                throw data
            }
        },
    },
}
