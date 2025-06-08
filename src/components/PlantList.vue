<template>
  <div class="container my-5">
    <h2 class="text-center mb-4">Список рослин</h2>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="plant in plants" :key="plant.id">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ plant.name }}</h5>
            <p class="card-text">
              <strong>Полив:</strong> {{ plant.watering }}<br />
              <strong>Світло:</strong> {{ plant.light }}<br />
              <strong>Температура:</strong> {{ plant.temperature }}<br />
              <strong>Примітки:</strong> {{ plant.notes }}
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
  onSnapshot(colRef, snapshot => {
    plants.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  })
})
</script>
