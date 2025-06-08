<template>
  <div>
    <nav v-if="user" class="navbar navbar-expand-lg navbar-dark bg-success">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/">🌿 Порадник</router-link>
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Головна</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/add" class="nav-link">Додати пораду</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/my" class="nav-link">Мої рослини</router-link>
            </li>
            <li class="nav-item">
              <button @click="logout" class="btn btn-sm btn-light ms-3">Вийти</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container my-5" v-if="user" style="max-width: 720px">
      <div v-if="!isAdded" class="card shadow rounded-4 p-4">
        <h2 class="text-center mb-4">Додати пораду по рослині</h2>
        <form @submit.prevent="addPlant" class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Назва рослини</label>
            <input v-model="plant.name" type="text" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Полив</label>
            <input v-model="plant.watering" type="text" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Освітлення</label>
            <input v-model="plant.light" type="text" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Температура</label>
            <input v-model="plant.temperature" type="text" class="form-control" />
          </div>
          <div class="col-12">
            <label class="form-label">Примітки</label>
            <textarea v-model="plant.notes" class="form-control" rows="3"></textarea>
          </div>
          <div class="col-12">
            <label class="form-label">Зображення (необов’язково)</label>
            <input type="file" accept="image/*" class="form-control" @change="handleImage" />
          </div>
          <div class="col-12 text-center" v-if="preview">
            <img :src="preview" alt="Прев’ю" class="img-fluid rounded mt-3" style="max-height: 300px;" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-success w-100 py-2 mt-3">➕ Додати пораду</button>
          </div>
        </form>
      </div>

      <div v-else class="card shadow rounded-4 p-4 text-center bg-light">
        <h4 class="mb-3 text-success">✅ Пораду додано успішно!</h4>
        <router-link to="/" class="btn btn-outline-success me-2">На головну</router-link>
        <button class="btn btn-outline-primary ms-2" @click="isAdded = false">Додати ще</button>
      </div>
    </div>

    <div v-else class="container my-5 text-center">
      <div class="alert alert-warning">Увійдіть, щоб додати пораду.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/firebase'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const user = ref(null)
const isAdded = ref(false)
const preview = ref(null)
const router = useRouter()

const plant = ref({
  name: '',
  watering: '',
  light: '',
  temperature: '',
  notes: '',
  image: null
})

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (u) => {
    user.value = u
  })
})

const handleImage = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    preview.value = reader.result
    plant.value.image = reader.result // base64
  }
  reader.readAsDataURL(file)
}

const addPlant = async () => {
  const colRef = collection(db, 'plants')
  await addDoc(colRef, {
    ...plant.value,
    userId: user.value.uid
  })

  plant.value = {
    name: '',
    watering: '',
    light: '',
    temperature: '',
    notes: '',
    image: null
  }
  preview.value = null
  isAdded.value = true
}

const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  router.push('/login')
}
</script>
