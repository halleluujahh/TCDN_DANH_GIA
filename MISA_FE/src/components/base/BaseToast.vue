<script setup>
import { ref, onMounted, watch } from "vue";

/**
 * BaseToast Component - Toast notification với auto dismiss
 * Hỗ trợ: success, error, warning, info types
 * Auto dismiss sau duration hoặc click close button
 * Hiển thị animation khi appear/disappear
 * Created By hanv 20/01/2026
 */

/**
 * Props cho BaseToast component
 * Created By hanv 20/01/2026
 */
const props = defineProps({
  /**
   * Nội dung message hiển thị (required)
   * @type {String}
   */
  message: {
    type: String,
    required: true,
  },
  /**
   * Kiểu toast: success, error, warning, info
   * Quy định màu sắc và icon hiển thị
   * @type {String}
   */
  type: {
    type: String,
    default: "success",
    validator: (value) =>
      ["success", "error", "warning", "info"].includes(value),
  },
  /**
   * Thời gian hiển thị tính bằng milliseconds (ms)
   * Nếu duration = 0 thì không auto dismiss
   * @type {Number}
   */
  duration: {
    type: Number,
    default: 3000,
  },
  /**
   * Vị trí hiển thị: top hoặc bottom
   * @type {String}
   */
  position: {
    type: String,
    default: "top",
    validator: (value) => ["top", "bottom"].includes(value),
  },
});

/**
 * Emit close event khi toast dismissed
 * Created By hanv 20/01/2026
 */
const emit = defineEmits(["close"]);

/**
 * Trạng thái hiển thị của toast
 * @type {Boolean}
 */
const isVisible = ref(false);

/**
 * Timeout ID để track auto dismiss timer
 * Created By hanv 20/01/2026
 */
let timer = null;

/**
 * Mount hook - Hiển thị toast và set auto dismiss timer
 * Created By hanv 20/01/2026
 */
onMounted(() => {
  isVisible.value = true;
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close();
    }, props.duration);
  }
});

/**
 * Đóng toast notification
 * Ẩn toast với animation, sau đó emit close event
 * Delay 150ms để đợi animation xong
 * Created By hanv 20/01/2026
 */
function close() {
  isVisible.value = false;
  setTimeout(() => {
    emit("close");
  }, 150);
}

/**
 * Xử lý click trên toast
 * Clear timer và đóng toast
 * Created By hanv 20/01/2026
 */
function handleClick() {
  if (timer) {
    clearTimeout(timer);
  }
  close();
}

/**
 * Watch message prop - Reset timer khi message thay đổi
 * Nếu duration > 0 thì tắt timer cũ và set timer mới
 * Created By hanv 20/01/2026
 */
watch(
  () => props.message,
  () => {
    if (timer) {
      clearTimeout(timer);
    }
    if (props.duration > 0) {
      timer = setTimeout(() => {
        close();
      }, props.duration);
    }
  },
);
</script>

<template>
  <Transition name="toast-fade">
    <div
      v-if="isVisible"
      :class="[
        'v-toast__item',
        `v-toast__item--${type}`,
        `v-toast__item--${position}`,
      ]"
      @click="handleClick"
    >
      <span class="v-toast__icon"></span>
      <span class="v-toast__text">
        <div class="flex-between flex1">
          <div class="max-width">{{ message }}</div>
          <div class="icon20 close pointer ml-16px" @click.stop="close"></div>
        </div>
      </span>
    </div>
  </Transition>
</template>

<style scoped>
.v-toast.v-toast--top {
  flex-direction: column;
}

.v-toast {
  position: fixed;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2em;
  overflow: hidden;
  z-index: 1090;
  pointer-events: none;
}
.v-toast__item.v-toast__item--success {
  display: flex;
  align-items: center;
}

.v-toast__item.v-toast__item--top,
.v-toast__item.v-toast__item--bottom {
  align-self: center;
}
.v-toast__item {
  min-width: 300px;
  min-height: 40px;
}
.v-toast__item {
  background-color: #fff !important;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 16px #0000003d;
  max-width: 552px;
  min-height: 40px;
  padding: 8px 0;
  border-radius: 4px;
  position: relative;
  align-items: flex-start;
}
.v-toast__item {
  opacity: 1;
  min-height: 40px;
}
.v-toast__item--success {
  background-color: #47d78a;
}
.v-toast__item.v-toast__item--success:before {
  background: #009b71;
}

.v-toast__item.v-toast__item--success .v-toast__icon {
  background: url(
      data:image/svg + xml,
      %3csvgxmlns="http://www.w3.org/2000/svg"viewBox="0 0 52 52"%3e%3cpathfill="%23fff"d="M26 0C11.664 0 0 11.663 0 26s11.664 26 26 26 26-11.663 26-26S40.336 0 26 0zm14.495 17.329l-16 18a1.997 1.997 0 01-2.745.233l-10-8a2 2 0 012.499-3.124l8.517 6.813L37.505 14.67a2.001 2.001 0 012.99 2.659z"/%3e%3c/svg%3e
    )
    no-repeat;
}
.v-toast__item .v-toast__icon {
  height: 20px;
  width: 20px;
  min-width: 20px;
  margin: 1px 8px 0 16px;
  position: relative;
  background-color: #fff !important;
}
.v-toast__item .v-toast__icon {
  display: block;
  width: 27px;
  min-width: 27px;
  height: 27px;
  margin-left: 1em;
  background: url(
      data:image/svg + xml,
      %3csvgxmlns="http://www.w3.org/2000/svg"viewBox="0 0 45.999 45.999"%3e%3cpathfill="%23fff"d="M39.264 6.736c-8.982-8.981-23.545-8.982-32.528 0-8.982 8.982-8.981 23.545 0 32.528 8.982 8.98 23.545 8.981 32.528 0 8.981-8.983 8.98-23.545 0-32.528zM25.999 33a3 3 0 11-6 0V21a3 3 0 116 0v12zm-3.053-17.128c-1.728 0-2.88-1.224-2.844-2.735-.036-1.584 1.116-2.771 2.879-2.771 1.764 0 2.88 1.188 2.917 2.771-.001 1.511-1.152 2.735-2.952 2.735z"/%3e%3c/svg%3e
    )
    no-repeat;
}
.v-toast__icon {
  display: none;
}
.v-toast__item:before {
  position: absolute;
  content: "";
  width: 16px;
  height: 100%;
  border-radius: 4px;
  background: red;
  top: 0;
  left: 0;
}
.v-toast__item.v-toast__item--success .v-toast__icon:before {
  background-position: -98px -168px;
}

.v-toast__item .v-toast__icon:before {
  content: "";
  background: transparent url("../../assets/icon/pas.qtsx_icon-e5768799.svg")
    no-repeat;
  position: absolute;
  height: 20px;
  width: 20px;
  top: 0;
  right: 0;
}
.v-toast__item .v-toast__text {
  padding: 0 16px 0 0;
  color: #111827;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 24px;
  line-height: 24px;
}

.v-toast__item .v-toast__text {
  padding: 1.5em 1em;
}
.v-toast__text {
  margin: 0;
  padding: 0.5em 1em;
  word-break: break-word;
}
.close {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -299px -16px;
  background-color: #4b5563;
}
.v-toast__item .flex-between {
  align-items: flex-start;
}

.flex1 {
  flex: 1;
  min-height: 0;
  min-width: 0;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.v-toast__item:after {
  content: "";
  position: absolute;
  width: 12px;
  height: 100%;
  background: #fff;
  top: 0;
  left: 6px;
  border-radius: 9px;
}
.v-toast.v-toast--bottom {
  flex-direction: column-reverse;
}

.v-toast {
  position: fixed;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2em;
  overflow: hidden;
  z-index: 1090;
  pointer-events: none;
}
/* Animations */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.15s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
