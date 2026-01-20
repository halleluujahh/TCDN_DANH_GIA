<script setup>
import { ref } from "vue";
import BaseToast from "./base/BaseToast.vue";

/**
 * ToastContainer Component - Container quản lý tất cả toast notifications
 * Hiển thị multiple toasts cùng lúc
 * Hỗ trợ positioning: top và bottom
 * Auto remove toast khi close event được trigger
 * Created By hanv 20/01/2026
 */

/**
 * Danh sách toasts hiện đang hiển thị
 * Mỗi toast có: id, message, type, duration, position
 * @type {Array<Object>}
 */
const toasts = ref([]);

/**
 * Counter để generate unique toast IDs
 * @type {Number}
 */
let toastId = 0;

/**
 * Thêm toast mới vào container
 * Generate unique ID và thêm vào danh sách toasts
 * @param {Object} options - Toast options
 * @param {String} options.message - Toast message content (required)
 * @param {String} options.type - Toast type: success, error, warning, info
 * @param {Number} options.duration - Auto-dismiss time in milliseconds
 * @param {String} options.position - Position: top or bottom
 * Created By hanv 20/01/2026
 */
function addToast(options) {
  const id = toastId++;
  toasts.value.push({
    id,
    ...options,
  });
}

/**
 * Xóa toast khỏi container
 * Tìm toast theo ID và xóa khỏi danh sách
 * @param {Number} id - Toast ID cần xóa
 * Created By hanv 20/01/2026
 */
function removeToast(id) {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
}

/**
 * Expose methods cho parent component
 * Cho phép gọi addToast từ parent qua template ref
 * Created By hanv 20/01/2026
 */
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
