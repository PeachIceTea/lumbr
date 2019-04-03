<template lang="pug">
    .index
        .user-info(v-if="authenticated")
            span Hi, {{this.$store.state.auth.user.name}}
        .navigation
            nuxt-link(to="/post") Posts
            |
            |
            nuxt-link(to="/user/login" v-if="!authenticated") Login
            span.logout-link(v-else @click="logout") Logout
</template>

<script>
export default {
    computed: {
        authenticated() {
            return !!this.$store.state.auth.jwt
        },
    },
    methods: {
        logout() {
            this.$store.dispatch("auth/logout")
            this.$router.push("/user/login")
        },
    },
}
</script>


<style lang="less" scoped>
.logout-link {
    color: blue;
    cursor: pointer;
    text-decoration: underline;
}
</style>
