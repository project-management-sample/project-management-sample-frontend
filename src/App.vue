<template>
  <div class="app-wrapper">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f0f2f5;
  color: #333;
}

.app-wrapper {
  min-height: 100vh;
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}
</style>
