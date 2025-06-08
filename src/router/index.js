import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddPlant from '../components/AddPlant.vue'
import Login from '../views/Login.vue'
import MyPlants from '../components/MyPlants.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/add', name: 'AddPlant', component: AddPlant },
    { path: '/login', name: 'Login', component: Login },
    { path: '/my-plants', name: 'MyPlants', component: MyPlants }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
