import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

import User from "./routes/user"
import Home from "./routes/user/Home"

export default new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/user",
            component: User,
            children: [
                {
                    path: "home",
                    component: Home,
                },
            ],
        },
    ],
})
