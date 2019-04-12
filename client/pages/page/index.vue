<template>
    <div class="post-index">
        <PostPage :page="1" />
    </div>
</template>

<script>
import PostPage from "~/components/post-page"
export default {
    async fetch({ store }) {
        await store.dispatch("posts/getPosts", 0)
    },
    components: { PostPage },
}
</script>
