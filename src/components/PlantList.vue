<template>
  <div class="container my-5">
    <h2 class="text-center mb-4">Список порад по рослинах</h2>

    <div v-if="plants.length === 0" class="text-center text-muted">
      <p>Наразі поради відсутні. Додайте першу!</p>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="plant in plants" :key="plant.id">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <img v-if="plant.image" :src="plant.image" class="card-img-top" alt="Фото рослини"
               style="max-height: 220px; object-fit: cover;" />
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/firebase'
import { collection, onSnapshot } from 'firebase/firestore'

const plants = ref([])

onMounted(() => {
  const colRef = collection(db, 'plants')
  onSnapshot(colRef, (snapshot) => {
    plants.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  })
})
</script>
