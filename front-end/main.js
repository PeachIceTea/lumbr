import Vue from "vue"

import router from "./router"
import store from "./store"
import App from "./App"

const vm = new Vue({
    el: "#app-container",
    render: h => h(App),
    router,
    store,
})
