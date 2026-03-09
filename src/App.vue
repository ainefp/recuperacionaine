<template>
  <div>
    <NavBar />
    <main> <!-- class="flex-grow-1 overflow-auto" -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
  import NavBar from './components/NavBar.vue';
</script>

<style scoped>
  @media (max-width: 768px) {
    body {
      background: lightgray;
      }
  }
</style>
