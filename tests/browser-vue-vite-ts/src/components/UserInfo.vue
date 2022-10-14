<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  username: String,
});

const userInfo = ref({});

onMounted(async () => {
  const res = await fetch(`https://api.github.com/users/${props.username}`);
  const data = await res.json();
  userInfo.value = data;
});


</script>

<template>
  <div class="root">
    <img class="img" :src="userInfo.avatar_url" />
    <div>
      <span>name: </span>
      <span>{{userInfo.name}}</span>
    </div>
  </div>
</template>

<style scoped>
.root {
  color: #888;
}

.img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}
</style>
