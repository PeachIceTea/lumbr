<template lang="pug">
    .auth-form
        form(@submit.prevent="submit")
            label Username
                br
                input(type="text" v-model="name" :class="nameClass" placeholder="Username")
            br
            label Password
                br
                input(type="password" v-model="password" :class="passwordClass" placeholder="Password")
            br
            input(type="submit")
</template>

<script>
import validators from "../../../../shared/validators"

export default {
    data() {
        return {
            name: "",
            password: "",
        }
    },
    props: ["callback"],
    methods: {
        submit() {
            this.callback(this.name, this.password)
        },
    },
    computed: {
        nameClass() {
            if (validators.isValidUsername(this.name)) {
                return "valid"
            } else {
                return "invalid"
            }
        },
        passwordClass() {
            if (validators.isValidPassword(this.password)) {
                return "valid"
            } else {
                return "invalid"
            }
        },
    },
}
</script>

<style lang="less" scoped>
.invalid {
    border-color: red;
}

.valid {
    border-color: green;
}
</style>

