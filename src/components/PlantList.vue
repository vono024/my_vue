<template>
  <div class="container my-5">
    <h2 class="text-center mb-4">Список рослин</h2>

    <div v-if="plants.length === 0" class="text-center text-muted">
      <p>Немає доданих порад</p>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="plant in plants" :key="plant.id">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <img
              v-if="plant.image"
              :src="plant.image"
              class="card-img-top"
              alt="Зображення рослини"
              style="object-fit: cover; height: 200px;"
          />
          <div class="card-body">
            <h5 class="card-title">{{ plant.name }}</h5>
            <p class="card-text mb-2">
              <span class="fw-semibold">Полив:</span> {{ plant.watering }}<br />
              <span class="fw-semibold">Світло:</span> {{ plant.light }}<br />
              <span class="fw-semibold">Температура:</span> {{ plant.temperature }}<br />
              <span class="fw-semibold">Примітки:</span> {{ plant.notes }}
            </p>
            <div v-if="currentUser" class="d-flex align-items-center gap-2">
              <button
                  class="btn btn-sm"
                  :class="isLikedByUser(plant) ? 'btn-danger' : 'btn-outline-danger'"
                  @click="toggleLike(plant)"
              >
                ❤️ {{ plant.likes?.length || 0 }}
              </button>
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
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const plants = ref([])
const currentUser = ref(null)

const isLikedByUser = (plant) => {
  return plant.likes?.includes(currentUser.value?.uid)
}

const toggleLike = async (plant) => {
  const uid = currentUser.value?.uid
  if (!uid) return

  const plantRef = doc(db, 'plants', plant.id)
  const alreadyLiked = plant.likes?.includes(uid)

  try {
    await updateDoc(plantRef, {
      likes: alreadyLiked ? arrayRemove(uid) : arrayUnion(uid)
    })
  } catch (err) {
    console.error('Помилка при оновленні лайків:', err)
  }
}

const fixUserIdsIfMissing = async () => {
  const snapshot = await getDocs(collection(db, 'plants'))
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data()
    if (!data.userId) {
      await updateDoc(doc(db, 'plants', docSnap.id), {
        userId: 'unknown'
      })
    }
  }
}

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user

    await fixUserIdsIfMissing()

    const colRef = collection(db, 'plants')
    onSnapshot(colRef, (snapshot) => {
      plants.value = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          likes: data.likes || [],
          image: data.image || ''
        }
      })
    })
  })
})
</script>
