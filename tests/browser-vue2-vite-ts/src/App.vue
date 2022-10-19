<script lang="ts">
import { defineComponent } from 'vue';
import UserInfo from './components/UserInfo.vue';

export default defineComponent({
  components: {
    UserInfo,
  }
})

</script>

<template>
  <div class="app-root">
    <h1 class="app-root-title">User</h1>
    <user-info username="xlianghang" />
  </div>
</template>

<style scoped>
.app-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.app-root-title {
  margin: 10px;
}
</style>
