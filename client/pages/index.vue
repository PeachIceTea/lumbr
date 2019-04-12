<template>
    <div class="index">
        <div class="auth">
            <nuxt-link :to="'/user/auth'" v-if="!authenticated">
                Login or Register
            </nuxt-link>
            <span v-else>
                Hi, {{ username }}.
                <span class="logout" @click="logout">Logout</span>
            </span>
        </div>
        <nuxt-link :to="'/page'">Posts</nuxt-link>
    </div>
</template>

<script>
export default {
    redirect: "/post",
    computed: {
        authenticated() {
            return !!this.$store.state.auth.jwt
        },
        username() {
            return this.$store.state.auth.name
        },
    },
    methods: {
        logout() {
            this.$store.dispatch("auth/logout")
        },
    },
}
</script>

<style lang="less" scoped>
.logout {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}
</style>
