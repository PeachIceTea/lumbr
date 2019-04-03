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
        addCommentToPost(state, comment) {
            state.post.comments.push(comment)
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
        async submitComment({ commit, state, rootState }, content) {
            const { data } = await axios.post(
                `post/${state.post.postid}/comment/new`,
                { content }
            )
            if (!data.errno) {
                commit("addCommentToPost", {
                    content,
                    userid: rootState.auth.user.id,
                    name: rootState.auth.user.name,
                    commentid: data.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
            } else {
                console.error(data)
            }
        },
    },
}
