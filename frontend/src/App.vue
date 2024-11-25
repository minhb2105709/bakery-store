<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';

const route = useRoute();
</script>

<template>
  <router-view />

  <AppFooter />
</template>

<style>
  .page {
    max-width: 400px;
    margin: auto;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f9f9f9;
  }
</style>
