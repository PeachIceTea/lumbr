<template>
    <div class="auth-form">
        <div class="error" v-if="hasError">Error: {{ error.error }}</div>
        <form @submit.prevent="submit">
            <div class="input">
                <div class="username">
                    <label>
                        Username
                        <br />
                        <input
                            type="text"
                            v-model="name"
                            :class="usernameStyle"
                            placeholder="Username"
                        />
                    </label>
                </div>
                <br />
                <div class="password">
                    <label>
                        Password
                        <br />
                        <input
                            v-model="password"
                            :class="passwordStyle"
                            type="password"
                            placeholder="Password"
                        />
                    </label>
                </div>
                <br />
                <div class="submit">
                    <input
                        type="submit"
                        :disabled="!(isValidUsername && isValidPassword)"
                    />
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import validators from "../../validators"

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
    props: ["callback", "error", "hasError"],
}
</script>

<style lang="less" scoped>
.auth-form {
    display: inline-block;
}

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
