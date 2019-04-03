<template lang="pug">
    .posts-container
        .intro
            span Lumbr
            br
            nuxt-link(:to="'post/upload'") Upload a new image
        .post(v-for="post in posts")
            Thumb(:post="post")
</template>

<script>
import Thumb from "~/components/thumb"
export default {
    async fetch({ store }) {
        await store.dispatch("posts/getPosts")
    },
    computed: {
        posts() {
            return this.$store.state.posts.posts
        },
    },
    components: { Thumb },
}
</script>

<style lang="less">
.posts-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.post {
    display: inline-block;
}
</style>
