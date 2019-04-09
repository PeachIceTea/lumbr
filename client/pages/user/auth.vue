<template>
    <div class="auth">
        <div class="form login">
            <h1>Login</h1>
            <AuthForm
                :callback="login"
                :error="error"
                :hasError="lastAction === 'login' && error"
            />
        </div>
        <div class="form register">
            <h1>Register</h1>
            <AuthForm
                :callback="register"
                :error="error"
                :hasError="lastAction === 'register' && error"
            />
        </div>
    </div>
</template>

<script>
import AuthForm from "~/components/auth-form"

export default {
    middleware: "notAuthenticated",
    components: { AuthForm },
    methods: {
        async login(name, password) {
            await this.$store.dispatch("auth/login", {
                name,
                password,
            })
            this.$router.push("/")
        },
        async register(name, password) {
            await this.$store.dispatch("auth/register", {
                name,
                password,
            })
            this.$router.push("/")
        },
    },
    computed: {
        error: {
            get() {
                return this.$store.state.auth.error
            },
            // Vue expects a setter when using v-bind. This makes that error disappear
            set() {},
        },
        lastAction() {
            return this.$store.state.auth.lastAuthType
        },
    },
}
</script>

<style lang="less" scoped>
.form {
    display: inline-block;
}
</style>
