<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import LoginHeader from '@/components/LoginHeader.vue';

const route = useRoute();

// Check if the current route is the login page
const isLoginPage = computed(() => route.path === '/login');

// Set the header component based on the route
const headerComponent = computed(() => (isLoginPage.value ? LoginHeader : AppHeader));
</script>

<template>
  <!-- Render the selected header component -->
  <component :is="headerComponent" />

  <div class="container-fluid">
    <router-view />
  </div>
</template>

<style>
  .page {
    max-width: 400px;
    margin: auto;
  }
</style>
