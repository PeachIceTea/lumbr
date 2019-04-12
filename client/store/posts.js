import axios from "../axios"

export default {
    state() {
        return {
            posts: [],
            post: 0,
            error: null,
        }
    },
    mutations: {
        setPosts(state, posts) {
            state.posts = posts
        },
        setPost(state, post) {
            state.post = post
        },
        addCommentToPost(state, comment) {
            state.post.comments.push(comment)
        },
        setError(state, error) {
            state.error = error
        },
        clearError(state) {
            state.error = null
        },
    },
    actions: {
        async getPosts({ commit }, page) {
            const { data } = await axios.get(`post/page/${page}`)
            if (!data.errno) {
                commit("setPosts", data)
            } else {
                throw data
            }
        },
        async getPost({ commit }, id) {
            const { data } = await axios.get(`post/${id}`)
            if (!data.errno) {
                commit("setPost", data)
            } else {
                throw data
            }
        },
        async submitComment({ commit, state, rootState }, content) {
            const { data } = await axios.post(
                `post/${state.post.id}/comment/new`,
                { content }
            )
            if (!data.error) {
                commit("addCommentToPost", data)
            } else {
                console.error(data)
            }
        },
        async new({ commit }, image) {
            const form = new FormData()
            form.append("image", new Blob([image]))
            const { data } = await axios.post("post/new", form)
            if (!data.error) {
                commit("setPost", data)
            } else {
                console.error(data)
                commit("setError", data)
            }
        },
    },
}
