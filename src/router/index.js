import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddPlant from '../components/AddPlant.vue'
import Login from '../views/Login.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/add', name: 'AddPlant', component: AddPlant },
    { path: '/login', name: 'Login', component: Login }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
