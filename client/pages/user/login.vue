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
    components: { AuthForm },
    methods: {
        login(name, password) {
            this.$store.dispatch("users/login", { name, password })
        },
        register(name, password) {
            this.$store.dispatch("users/register", { name, password })
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

