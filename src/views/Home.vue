<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-success">
      <div class="container">
        <a class="navbar-brand" href="#">🌿 Порадник</a>
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/">Головна</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/add">Додати</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/login">Увійти</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <PlantList />
  </div>
</template>

<script setup>
import PlantList from '@/components/PlantList.vue'
</script>
