<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  props: {
    username: String,
  },
  setup(props) {
    const userInfo = ref({});
    const visible = ref(false);

    if (visible.value) {
      console.log('Will not execute here');
    }

    onMounted(async () => {
      const res = await fetch(`https://api.github.com/users/${props.username}`);
      const data = await res.json();
      userInfo.value = data;
    });

    return {
      userInfo,
      visible,
    }
  },
});
</script>

<template>
  <div class="user-info-root">
    <img class="user-info-img" :src="userInfo.avatar_url" />
    <div class="user-info-text">
      <span>name: </span>
      <span>{{ userInfo.name }}</span>
    </div>
    <div v-if="visible">
      <div>hided content</div>
    </div>
  </div>
</template>

<style scoped>
.user-info-root {
  width: 200px;
  color: #888;
}

.user-info-img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}

.user-info-text {
  text-align: center;
}
</style>
