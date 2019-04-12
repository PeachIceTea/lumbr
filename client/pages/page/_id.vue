<template>
    <div class="post-index">
        <PostPage :page="$route.params.id" />
    </div>
</template>

<script>
import PostPage from "~/components/post-page"
export default {
    validate({ params }) {
        return !isNaN(+params.id)
    },
    async fetch({ store, params }) {
        await store.dispatch("posts/getPosts", +params.id - 1)
    },
    components: { PostPage },
}
</script>
