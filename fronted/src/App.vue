<template>
  <div>
    <NavBar />
    <main> <!-- class="flex-grow-1 overflow-auto" -->
      <router-view />
    </main>
    <FooTer />
  </div>
</template>

<script setup>
  import NavBar from './components/NavBar.vue';
  import FooTer from './components/FooTer.vue';
</script>

<style scoped>
  @media (max-width: 768px) {
    body {
      background: lightgray;
      }
  }
</style>
