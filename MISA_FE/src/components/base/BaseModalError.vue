<script setup>
import { useShortCut } from '../../composables/useShortCut';

/**
 * BaseModalError Component - Modal thông báo lỗi/cảnh báo
 * Hiển thị modal overlay với title, message và footer buttons
 * Hỗ trợ đóng bằng phím ESC
 * Created By hanv 20/01/2026
 */

const props = defineProps({
  /**
   * Icon tên cho title
   * @type {String}
   */
  iconTitle: {
    type: String,
    default: "",
  },
  /**
   * Tooltip text cho icon đóng
   * @type {String}
   */
  iconTooltip: {
    type: String,
    default: "",
  },
  /**
   * Tiêu đề modal
   * @type {String}
   */
  title: {
    type: String,
    default: "",
  },
  /**
   * Nội dung message (hỗ trợ HTML)
   * @type {String}
   */
  message: {
    type: String,
    default: "",
  },
  /**
   * Danh sách footer buttons
   * Mỗi button có: text, type, action
   * @type {Array}
   */
  footerButtons: {
    type: Array,
    default: () => [],
  },
});

/**
 * Emit action event khi click button hoặc close icon
 * @event action
 * @param {String} action - Tên action cần thực hiện
 */
const emit = defineEmits(["action"]);

// Đóng modal khi nhấn phím ESC
useShortCut("esc", () => {
  emit("action", "closeErrorModal");
});
</script>

<template>
  <div class="msg-box" v-if="props.message && props.message !== ''">
    <div class="msg-center msg-box-container">
      <div class="flex gap-16px">
        <div class="msg-message">
          <div class="msg-header">
            <div class="title flex-center">
              <span
                :class="['icon20', 'mr-2', 'icon-' + props.iconTitle]"
              ></span>
              <div class="msg-title">{{ props.title }}</div>
            </div>
            <div class="icon-container">
              <div
                v-tooltip="props.iconTooltip"
                class="icon20 icon-close pointer"
                @click="$emit('action', 'closeErrorModal')"
              ></div>
            </div>
          </div>
          <div class="msg-item" v-html="props.message"></div>
        </div>
      </div>
      <div class="msg-buttons flex-end gap-8px">
        <div
          v-for="button in props.footerButtons"
          :key="button.text"
          :class="['ms-button', 'btn-' + button.type]"
          @click="$emit('action', button.action)"
        >
          <div class="text nowrap" v-html="button.text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msg-box {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #0000004d;
  z-index: 9999;
}
.msg-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 0 3px 20px #00000014;
  border-radius: 4px;
}
.msg-box-container {
  font-size: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  width: 432px;
}
.msg-message {
  display: flex;
  flex-direction: column;
  flex: 1;
  row-gap: 16px;
  margin-bottom: 16px;
}
.msg-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 0 3px 20px #00000014;
  border-radius: 4px;
}
.msg-message .msg-header {
  display: flex;
  align-items: center;
  height: 24px;
  justify-content: space-between;
}
.msg-message .msg-header .icon-container {
  display: flex;
  align-items: center;
  height: 24px;
  width: 24px;
  justify-content: center;
}
.msg-title {
  font-weight: 600;
  color: #111827;
  font-size: 20px;
}
.icon-danger {
  mask-image: url("../../assets/icon/pas.qtsx_icon-e5768799.svg");
  mask-repeat: no-repeat;
  mask-position: -249px -168px;
  background-color: #dc2626;
}
.icon-close {
  mask-image: url("../../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -299px -16px;
  background-color: #4b5563;
}
.msg-item {
  font-size: 13px;
  max-height: 400px;
  overflow-y: auto;
  font-weight: 400;
  line-height: 20px;
  max-width: 100%;
  overflow-wrap: anywhere;
}
.msg-buttons {
  border-radius: 0 0 2px 2px;
}
</style>
