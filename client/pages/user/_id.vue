<template lang="pug">
    .user-container
        h1.name {{user.name}}
        .since User since {{since}}
        h1 Posts
        .posts
            .post(v-for="post in user.posts")
                Thumb(:post="post")
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
