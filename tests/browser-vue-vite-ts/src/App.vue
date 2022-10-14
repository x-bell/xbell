<script setup lang="ts">
import { defineComponent } from 'vue';
import UserInfo from './components/UserInfo.vue';

defineComponent({
  UserInfo
})

</script>

<template>
  <div>
    <h1>User</h1>
    <user-info username="xlianghang" />
  </div>
</template>

<style scoped>

</style>
