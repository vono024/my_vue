<template>
  <div class="container my-5" v-if="currentUser">
    <h2 class="text-center mb-4">Список рослин</h2>

    <div v-if="plants.length === 0" class="text-center text-muted">
      <p>Немає доданих порад. Додайте свою!</p>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="plant in plants" :key="plant.id">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <div class="card-body">
            <h5 class="card-title">{{ plant.name }}</h5>
            <p class="card-text mb-2">
              <span class="fw-semibold">Полив:</span> {{ plant.watering }}<br />
              <span class="fw-semibold">Світло:</span> {{ plant.light }}<br />
              <span class="fw-semibold">Температура:</span> {{ plant.temperature }}<br />
              <span class="fw-semibold">Примітки:</span> {{ plant.notes }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container my-5 text-center">
    <div class="alert alert-warning">Увійдіть, щоб переглянути поради.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const plants = ref([])
const currentUser = ref(null)

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user

    if (user) {
      const colRef = collection(db, 'plants')
      onSnapshot(colRef, (snapshot) => {
        plants.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log('Синхронізовано:', plants.value.length)
      })
    }
  })
})
</script>
