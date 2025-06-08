<template>
  <div class="container my-5" v-if="user" style="max-width: 720px">
    <div v-if="!isAdded" class="card shadow rounded-4 p-4">
      <h2 class="text-center mb-4">Додати пораду по рослині</h2>
      <form @submit.prevent="addPlant" class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Назва рослини</label>
          <input v-model="plant.name" type="text" class="form-control" placeholder="Наприклад: Фікус" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Полив</label>
          <input v-model="plant.watering" type="text" class="form-control" placeholder="1 раз на тиждень" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Освітлення</label>
          <input v-model="plant.light" type="text" class="form-control" placeholder="Розсіяне світло" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Температура</label>
          <input v-model="plant.temperature" type="text" class="form-control" placeholder="18–25°C" />
        </div>
        <div class="col-12">
          <label class="form-label">Примітки</label>
          <textarea v-model="plant.notes" class="form-control" rows="3" placeholder="Додаткові поради"></textarea>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-success w-100 py-2">➕ Додати пораду</button>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'

const user = ref(null)
const isAdded = ref(false)

const plant = ref({
  name: '',
  watering: '',
  light: '',
  temperature: '',
  notes: ''
})

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (u) => {
    user.value = u
  })
})

const addPlant = async () => {
  if (!user.value) return

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
    notes: ''
  }

  isAdded.value = true
}
</script>
