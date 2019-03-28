<template lang="pug">
    .auth
        .login
            h1 Login
            auth-form(:callback="login")
        .register
            h1 Register
            auth-form(:callback="register")
</template>

<script>
import form from "./form"

export default {
    components: { "auth-form": form },
    methods: {
        login(name, password) {
            console.log(name, password)
        },
        register(name, password) {
            console.log(name, password)
        },
    },
}
</script>
