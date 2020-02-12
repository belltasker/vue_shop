import Vue from "vue"
import VueRouter from "vue-router"
import Login from "@/components/login/login.vue"
import Home from "@/components/home/home.vue"
import Users from "@/components/users/users.vue"

Vue.use(VueRouter)

const routes = [
  {
    name: "login",
    path: "/login",
    component: Login
  },
  {
    name: "home",
    path: "/",
    component: Home,
    children: [{ name: "users", path: "/users", component: Users }]
  }
]

const router = new VueRouter({
  routes
})

export default router
