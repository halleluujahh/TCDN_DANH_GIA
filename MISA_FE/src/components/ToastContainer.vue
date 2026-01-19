<script setup>
import { ref } from "vue";
import BaseToast from "./base/BaseToast.vue";

const toasts = ref([]);
let toastId = 0;

function addToast(options) {
  const id = toastId++;
  toasts.value.push({
    id,
    ...options,
  });
}

function removeToast(id) {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
}

// Expose methods to be called from parent
defineExpose({
  addToast,
});
</script>

<template>
  <div>
    <div class="v-toast v-toast--top">
      <BaseToast
        v-for="toast in toasts.filter((t) => t.position === 'top' || !t.position)"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type || 'success'"
        :duration="toast.duration || 3000"
        :position="toast.position || 'top'"
        @close="removeToast(toast.id)"
      />
    </div>
    <div class="v-toast v-toast--bottom">
      <BaseToast
        v-for="toast in toasts.filter((t) => t.position === 'bottom')"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type || 'success'"
        :duration="toast.duration || 3000"
        :position="toast.position || 'bottom'"
        @close="removeToast(toast.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.v-toast {
  position: fixed;
  display: flex;
  left: 0;
  right: 0;
  padding: 2em;
  overflow: hidden;
  z-index: 1090;
  pointer-events: none;
}

.v-toast.v-toast--top {
  flex-direction: column;
  top: 0;
}

.v-toast.v-toast--bottom {
  flex-direction: column-reverse;
  bottom: 0;
}
</style>
