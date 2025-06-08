<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">🌿 Порадник</router-link>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Головна</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/add">Додати</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-sm btn-outline-light ms-3" @click="logout">Вийти</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container my-5" v-if="currentUser">
      <h2 class="text-center mb-4">Мої рослини</h2>

      <div v-if="plants.length === 0" class="alert alert-info text-center">
        Ви ще не додали жодної поради 🌱
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col" v-for="plant in plants" :key="plant.id">
          <div class="card h-100 shadow-sm border-0 rounded-4">
            <img v-if="plant.image" :src="plant.image" class="card-img-top" alt="Фото рослини" style="max-height: 220px; object-fit: cover;" />
            <div class="card-body">
              <div v-if="editId === plant.id">
                <div class="mb-2">
                  <label class="form-label">Назва</label>
                  <input v-model="editPlantData.name" class="form-control" />
                </div>
                <div class="mb-2">
                  <label class="form-label">Полив</label>
                  <input v-model="editPlantData.watering" class="form-control" />
                </div>
                <div class="mb-2">
                  <label class="form-label">Світло</label>
                  <input v-model="editPlantData.light" class="form-control" />
                </div>
                <div class="mb-2">
                  <label class="form-label">Температура</label>
                  <input v-model="editPlantData.temperature" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Примітки</label>
                  <textarea v-model="editPlantData.notes" class="form-control" rows="2" />
                </div>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-success btn-sm px-4" @click="saveEdit(plant.id)">💾 Зберегти</button>
                  <button class="btn btn-outline-secondary btn-sm px-4" @click="cancelEdit">Скасувати</button>
                </div>
              </div>

              <div v-else>
                <h5 class="card-title">{{ plant.name }}</h5>
                <p class="card-text mb-2">
                  <span class="fw-semibold">Полив:</span> {{ plant.watering }}<br />
                  <span class="fw-semibold">Світло:</span> {{ plant.light }}<br />
                  <span class="fw-semibold">Температура:</span> {{ plant.temperature }}<br />
                  <span class="fw-semibold">Примітки:</span> {{ plant.notes }}
                </p>
                <div class="d-flex gap-2 mt-3">
                  <button class="btn btn-outline-primary btn-sm" @click="startEdit(plant)">✏️ Редагувати</button>
                  <button class="btn btn-outline-danger btn-sm" @click="deletePlant(plant.id)">🗑️ Видалити</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container my-5 text-center">
      <div class="alert alert-warning">Увійдіть, щоб переглянути свої рослини.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/firebase/firebase'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const router = useRouter()
const plants = ref([])
const currentUser = ref(null)
const editId = ref(null)
const editPlantData = ref({})

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user

    if (user) {
      const q = query(collection(db, 'plants'), where('userId', '==', user.uid))
      onSnapshot(q, (snapshot) => {
        plants.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      })
    }
  })
})

const deletePlant = async (id) => {
  await deleteDoc(doc(db, 'plants', id))
}

const startEdit = (plant) => {
  editId.value = plant.id
  editPlantData.value = { ...plant }
}

const cancelEdit = () => {
  editId.value = null
  editPlantData.value = {}
}

const saveEdit = async (id) => {
  const plantRef = doc(db, 'plants', id)
  await updateDoc(plantRef, { ...editPlantData.value })
  cancelEdit()
}

const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  router.push('/login')
}
</script>
