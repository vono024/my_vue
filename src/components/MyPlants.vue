<template>
  <div class="container my-5">
    <h2 class="text-center mb-4">Мої рослини</h2>

    <div v-if="!user" class="alert alert-warning text-center">
      Увійдіть, щоб переглядати свої рослини.
    </div>

    <div v-else-if="userPlants.length === 0" class="alert alert-info text-center">
      У вас ще немає доданих рослин.
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="plant in userPlants" :key="plant.id">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div v-if="editId === plant.id">
              <input v-model="editData.name" class="form-control mb-2" placeholder="Назва" />
              <input v-model="editData.watering" class="form-control mb-2" placeholder="Полив" />
              <input v-model="editData.light" class="form-control mb-2" placeholder="Світло" />
              <input v-model="editData.temperature" class="form-control mb-2" placeholder="Температура" />
              <textarea v-model="editData.notes" class="form-control mb-2" placeholder="Примітки" />
              <div class="d-flex gap-2">
                <button class="btn btn-success btn-sm" @click="saveEdit(plant.id)">💾 Зберегти</button>
                <button class="btn btn-secondary btn-sm" @click="cancelEdit">Скасувати</button>
              </div>
            </div>
            <div v-else>
              <h5 class="card-title">{{ plant.name }}</h5>
              <p class="card-text">
                <strong>Полив:</strong> {{ plant.watering }}<br />
                <strong>Світло:</strong> {{ plant.light }}<br />
                <strong>Температура:</strong> {{ plant.temperature }}<br />
                <strong>Примітки:</strong> {{ plant.notes }}
              </p>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm" @click="startEdit(plant)">✏️ Редагувати</button>
                <button class="btn btn-outline-danger btn-sm" @click="deletePlant(plant.id)">🗑️ Видалити</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/firebase'
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const user = ref(null)
const userPlants = ref([])
const editId = ref(null)
const editData = ref({})

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (u) => {
    user.value = u
    if (u) {
      const colRef = collection(db, 'plants')
      onSnapshot(colRef, (snapshot) => {
        userPlants.value = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(doc => doc.userId === u.uid)
      })
    }
  })
})

const deletePlant = async (id) => {
  await deleteDoc(doc(db, 'plants', id))
}

const startEdit = (plant) => {
  editId.value = plant.id
  editData.value = { ...plant }
}

const cancelEdit = () => {
  editId.value = null
  editData.value = {}
}

const saveEdit = async (id) => {
  const plantRef = doc(db, 'plants', id)
  await updateDoc(plantRef, { ...editData.value })
  cancelEdit()
}
</script>
