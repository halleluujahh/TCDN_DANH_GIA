<script setup>
import { ref, onMounted } from "vue";
import { setToastContainer } from "./composables/useToast";
import ToastContainer from "./components/ToastContainer.vue";

const toastContainerRef = ref(null);

onMounted(() => {
  if (toastContainerRef.value) {
    setToastContainer(toastContainerRef.value);
  }
});
</script>

<template>
  <div>
    <router-view />
    <ToastContainer ref="toastContainerRef" />
  </div>
</template>

<style>
/* Global styles  */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
@import "./assets/css/style.css";
@import "./assets/css/common.css";
</style>
