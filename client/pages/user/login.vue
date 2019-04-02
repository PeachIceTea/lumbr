<template lang="pug">
    .auth
        .login.form
            h1 Login
            AuthForm(:callback="login")
        .register.form
            h1 Register
            AuthForm(:callback="register")
</template>

<script>
import AuthForm from "~/components/auth-form"

export default {
    middleware: "notAuthenticated",
    components: { AuthForm },
    methods: {
        async login(name, password) {
            await this.$store.dispatch("auth/login", { name, password })
            this.$router.push("/user/home")
        },
        async register(name, password) {
            await this.$store.dispatch("auth/register", { name, password })
            this.$router.push("/user/home")
        },
    },
}
</script>

<style lang="less">
.auth {
    display: flex;
}

.form {
    display: inline-block;
    margin-right: 1em;
}
</style>

