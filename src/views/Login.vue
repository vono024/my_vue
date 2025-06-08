<template>
  <div class="container my-5" style="max-width: 500px">
    <h2 class="text-center mb-4">Вхід / Реєстрація</h2>
    <form @submit.prevent="() => {}">
      <div class="mb-3">
        <input v-model="email" type="email" class="form-control" placeholder="Email" required />
      </div>
      <div class="mb-3">
        <input v-model="password" type="password" class="form-control" placeholder="Пароль" required />
      </div>
      <div class="d-grid gap-2">
        <button @click="login" type="button" class="btn btn-success">Увійти</button>
        <button @click="register" type="button" class="btn btn-outline-success">Зареєструватись</button>
      </div>
      <div v-if="error" class="alert alert-danger mt-3 text-center">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const auth = getAuth()

const login = async () => {
  error.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = 'Невірний email або пароль'
  }
}

const register = async () => {
  error.value = ''
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = 'Помилка при реєстрації'
  }
}
</script>
