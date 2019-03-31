<template lang="pug">
    .auth-form
        form(v-on:submit.prevent="submit")
            .input
                label Username
                    br
                    input(v-model="name" :class="usernameStyle" type="text" placeholder="Username")
            .input
                Label Password
                    br
                    input(v-model="password" :class="passwordStyle" type="password" placeholder="Password")
            input(type="submit")
</template>

<script>
import validators from "~/../shared/validators"

export default {
    data() {
        return {
            name: "",
            password: "",
        }
    },
    computed: {
        isValidUsername() {
            return validators.isValidUsername(this.name)
        },
        isValidPassword() {
            return validators.isValidPassword(this.password)
        },
        usernameStyle() {
            if (this.name.length) {
                if (this.isValidUsername) {
                    return "valid"
                } else {
                    return "invalid"
                }
            }
        },
        passwordStyle() {
            if (this.password.length) {
                if (this.isValidPassword) {
                    return "valid"
                } else {
                    return "invalid"
                }
            }
        },
    },
    methods: {
        submit() {
            this.callback(this.name, this.password)
        },
    },
    props: ["callback"],
}
</script>

<style lang="less">
.input {
    margin-bottom: 0.25em;
}

.valid {
    border-color: green;
}

.invalid {
    border-color: red;
}
</style>
