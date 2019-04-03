<template lang="pug">
    .post
        .image-container
            img(:src="address + '/uploads/resized/' + post.filename + '.jpg'")
        .info
            div
                | Uploaded by
                |
                nuxt-link.user(:to="'/user/' + post.userid") {{post.uploader}}
            div Score: {{post.score}}
            .comments
                .comment(v-for="comment in post.comments")
                    nuxt-link.user(:to="'/user/' + comment.userid") {{comment.name}}
                    .content {{comment.content}}
                .new-comment(v-if="authenticated")
                    br
                    div Write a new comment
                    textarea.new-comment-text(v-model="newComment")
                    input(type="submit" @click="submitComment")
            nuxt-link(:to="'/post'") Back to posts
</template>

<script>
import { address } from "~/../shared/config"

export default {
    validate({ params }) {
        return !isNaN(+params.id)
    },
    async fetch({ store, params }) {
        await store.dispatch("posts/getPost", params.id)
    },
    data() {
        return {
            newComment: "",
        }
    },
    methods: {
        async submitComment() {
            await this.$store.dispatch("posts/submitComment", this.newComment)
            this.newComment = ""
        },
    },
    computed: {
        post() {
            return this.$store.state.posts.post
        },
        address() {
            return address
        },
        authenticated() {
            return !!this.$store.state.auth.jwt
        },
    },
}
</script>

<style lang="less" scoped>
.post {
    display: grid;
    grid-template-columns: 1fr;
}
.image-container {
    display: inline-block;
    object-fit: cover;
}

.info {
    display: inline-block;
}

img {
    width: 100%;
    height: auto;
}

.comments {
    border: 1px black solid;
    padding: 1px;
}

.comment {
    border: 1px black solid;
}

.content {
    margin-left: 1em;
}

@media only screen and (min-device-width: 768px) {
    img {
        width: auto;
        height: 100%;
    }

    .post {
        grid-template-columns: 0.5fr 0.5fr;
    }
}

.new-comment-text {
    width: 100%;
    font-size: 13pt;
}
</style>
