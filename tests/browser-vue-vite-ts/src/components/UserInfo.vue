<script setup lang="ts">
import { ref, onMounted } from 'vue'

const userInfo = ref({});


onMounted(async () => {
  const headers = new Headers();
  headers.set('authorization', 'Bearer eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1bXMiLCJzdWIiOjYxMDA2OTY5ODYsImF1ZCI6Imdhb2Rpbmd4IiwiZXhwIjoxNjYxOTk4MzkxLCJqdGkiOiJlMDhjMDllNWNiNjhlMGMzYzQ0NjdhYzkwOTk5MjhjODRhNWJhMTA5In0.JswzEiohIOnB5X7H2DsXXI-ZuWvSzbYFWrdgbxCedIo');

  const res = await window.fetch('/api/structure/user/current', {
    method: 'GET',
    headers,
  });

  const data = await res.json();
  userInfo.value = data;
});


</script>

<template>
  <h1>独立组件</h1>

  <div class="card">
    <span>user name:</span>
    <span>{{userInfo.name}}</span>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
