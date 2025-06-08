<template>
  <div class="container my-5" style="max-width: 420px">
    <h2 class="text-center mb-4">Вхід / Реєстрація</h2>

    <input v-model="email" type="email" class="form-control mb-3" placeholder="Email" required />
    <input v-model="password" type="password" class="form-control mb-3" placeholder="Пароль" required />

    <button @click="login" class="btn btn-success w-100 mb-2">Увійти</button>
    <button @click="register" class="btn btn-outline-success w-100">Зареєструватись</button>

    <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const auth = getAuth()

const translateFirebaseError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Цей email вже зареєстрований'
    case 'auth/invalid-email':
      return 'Некоректний формат email'
    case 'auth/weak-password':
      return 'Пароль має містити щонайменше 6 символів'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Невірний email або пароль'
    case 'auth/network-request-failed':
      return 'Помилка мережі. Перевірте підключення до інтернету'
    default:
      return 'Помилка: ' + error.message
  }
}

const login = async () => {
  errorMessage.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
    router.push('/')
  } catch (error) {
    errorMessage.value = translateFirebaseError(error)
  }
}

const register = async () => {
  errorMessage.value = ''
  try {
    await createUserWithEmailAndPassword(auth, email.value.trim(), password.value)
    router.push('/')
  } catch (error) {
    errorMessage.value = translateFirebaseError(error)
  }
}
</script>
