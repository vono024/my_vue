<template>
  <div class="container my-5" v-if="user">
    <h2 class="text-center mb-4">Додати пораду по рослині</h2>
    <form @submit.prevent="addPlant" class="row g-3">
      <div class="col-md-6">
        <input v-model="plant.name" type="text" class="form-control" placeholder="Назва рослини" required />
      </div>
      <div class="col-md-6">
        <input v-model="plant.watering" type="text" class="form-control" placeholder="Полив" required />
      </div>
      <div class="col-md-6">
        <input v-model="plant.light" type="text" class="form-control" placeholder="Світло" required />
      </div>
      <div class="col-md-6">
        <input v-model="plant.temperature" type="text" class="form-control" placeholder="Температура" />
      </div>
      <div class="col-12">
        <textarea v-model="plant.notes" class="form-control" rows="3" placeholder="Примітки"></textarea>
      </div>
      <div class="col-12">
        <button class="btn btn-success w-100">Додати</button>
      </div>
    </form>
  </div>

  <div class="container my-5" v-else>
    <div class="alert alert-warning text-center">Увійдіть, щоб додати пораду.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '@/firebase/firebase'
import { addDoc, collection } from 'firebase/firestore'

const plant = ref({
  name: '',
  watering: '',
  light: '',
  temperature: '',
  notes: ''
})

const user = ref(null)

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, u => {
    user.value = u
  })
})

const addPlant = async () => {
  const colRef = collection(db, 'plants')
  await addDoc(colRef, plant.value)
  plant.value = { name: '', watering: '', light: '', temperature: '', notes: '' }
  alert('Пораду додано!')
}
</script>
