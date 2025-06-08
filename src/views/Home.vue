<template>
  <div>

    <nav v-if="user" class="navbar navbar-expand-lg navbar-dark bg-success">
      <div class="container">
        <router-link to="/" class="navbar-brand">🌿 Порадник</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><router-link to="/" class="nav-link">Головна</router-link></li>
            <li class="nav-item"><router-link to="/add" class="nav-link">Додати пораду</router-link></li>
            <li class="nav-item"><router-link to="/my-plants" class="nav-link">Мої рослини</router-link></li>
            <li class="nav-item"><a @click="logout" class="nav-link" href="#">Вийти</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <div v-if="!user" class="d-flex align-items-center justify-content-center text-center text-white"
         style="height: 100vh; background: linear-gradient(135deg, #1e7d4d, #0c3b2e);">
      <div>
        <h1 class="display-4 fw-bold mb-4">🌱 Порадник по рослинах</h1>
        <p class="lead mb-4">Зберігайте поради, діліться доглядом і створюйте власну колекцію рослин</p>
        <router-link to="/login" class="btn btn-light btn-lg px-5">Увійти або Зареєструватись</router-link>
      </div>
    </div>

    <!-- КОНТЕНТ після входу -->
    <div v-else class="container">
      <PlantList />
    </div>
  </div>
</template>

<script setup>
import PlantList from '@/components/PlantList.vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const user = ref(null)
const router = useRouter()

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (u) => {
    user.value = u
  })
})

const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  router.push('/login')
}
</script>
