<template>
    <div class="user">
        <h1 class="name">{{ user.name }}</h1>
        <div class="since">User since {{ since }}</div>
        <h1>Posts ({{ user.post_count }})</h1>
        <div class="posts">
            <Thumb v-for="post in user.posts" :key="post.id" :post="post" />
        </div>
    </div>
</template>

<script>
import Thumb from "~/components/thumb"

export default {
    validate({ params }) {
        return !isNaN(+params.id)
    },
    async fetch({ store, params }) {
        await store.dispatch("users/getUser", params.id)
    },
    computed: {
        user() {
            return this.$store.state.users.user
        },
        since() {
            return new Date(this.user.created_at).toDateString()
        },
    },
    components: { Thumb },
}
</script>

<style lang="less" scoped>
.posts {
    display: grid;
    grid-template-columns: 0.2fr 0.2fr 0.2fr 0.2fr 0.2fr;
}
</style>
