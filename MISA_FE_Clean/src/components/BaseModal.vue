<script setup lang="ts">
// @ts-ignore
import { defineEmits, defineProps, ref } from "vue";
import { useShortCut } from "../composables/common/use-shortcut";

interface ModalProps {
  // Thuộc tính modal
  isClose: boolean;
  modalTitle?: string;
  isDrag?: boolean;
  style?: Record<string, string>;
  isHideFooterLine?: boolean;
  iconTitle?: string;
}
interface ModalEmits {
  (e: "close"): void;
  (e: "save"): void;
  (e: "save-and-add"): void;
}

const props = defineProps<ModalProps>();
const emits = defineEmits<ModalEmits>();

/**
 * Modal reference cho việc drag and positioning
 * @type {HTMLElement}
 */
const modalRef = ref<HTMLElement | null>(null);

/**
 * Drag state variables
 * isDragging: Tracking drag state
 * shiftX, shiftY: Offset từ vị trí click đến edge của modal
 * target: Reference tới modal element đang drag
 * Created By hanv 20/01/2026
 */
let isDragging = false;
let shiftX = 0;
let shiftY = 0;
let target: HTMLElement | null = null;
/**
 * Bắt đầu drag modal
 * Lưu vị trí ban đầu của chuột và offset modal
 * Thêm mousemove và mouseup listeners
 * @param {MouseEvent} e - Mouse down event từ modal header
 * Created By hanv 20/01/2026
 */
function startDrag(e: MouseEvent) {
  target = modalRef.value;
  isDragging = true;

  const rect = target!.getBoundingClientRect();
  shiftX = e.clientX - rect.left;
  shiftY = e.clientY - rect.top;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}

/**
 * Di chuyển modal khi chuột được drag
 * Cập nhật vị trí modal dựa trên mouse position
 * @param {MouseEvent} e - Mouse move event
 * Created By hanv 20/01/2026
 */
function onDrag(e: MouseEvent) {
  if (!isDragging) return;

  target!.style.position = "fixed";
  target!.style.left = e.clientX - shiftX + "px";
  target!.style.top = e.clientY - shiftY + "px";
}

/**
 * Kết thúc drag modal
 * Xóa event listeners cho mousemove và mouseup
 * Created By hanv 20/01/2026
 */
function stopDrag() {
  isDragging = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
}

/**
 * Đăng ký keyboard shortcuts
 * - Ctrl+Shift+S: Save and add
 * - Ctrl+S: Save
 * - ESC: Close modal
 * Created By hanv 20/01/2026
 */
useShortCut("ctrl+shift+s", () => {
  console.log("ctr shift s ");
});
useShortCut("ctrl+s", () => {
  emits("save");
});
useShortCut("esc", () => {
  emits("close");
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-container" v-if="!props.isClose">
      <div class="vfm vfm--inset vfm--fixed shift-detail ms-dynamic-popup">
        <div class="vfm__overlay vfm--overlay vfm--absolute vfm--inset"></div>
        <div
          class="vfm__container vfm--absolute vfm--inset vfm--outline-none modal-container"
        >
          <div
            class="vfm__content modal-content"
            ref="modalRef"
            :style="props.style"
          >
            <div
              @mousedown="props.isDrag && startDrag($event)"
              :class="[
                'modal__title',
                'modal__drag',
                props.isDrag && 'cursor-move',
              ]"
            >
              <div class="title-left">
                <span
                  :class="['icon20', 'mr-2', 'icon-' + props.iconTitle]"
                ></span>
                <div class="title">{{ props.modalTitle }}</div>
              </div>
              <div class="title-right">
                <slot name="buttonHeaderCluster"></slot>
              </div>
            </div>
            <div class="subHeader">
               <slot name="messageError"></slot>
            </div>
            <div class="modal__content flex-column flex1">
              <span
                class="popup-shortkey"
                shortkey="Close|Save|SaveAndAdd"
              ></span>
              <div class="container-content">
                <slot name="content"></slot>
              </div>
            </div>
            <div v-if="!isHideFooterLine" class="modal__footer__line"></div>
            <div class="modal__footer">
              <div class="flex footer-buttons-parent">
                <div class="flex footer-buttons-right footer-buttons">
                  <slot name="footer"></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.vfm--fixed {
  position: fixed;
}
.vfm--inset {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.modals-container .shift-detail {
  z-index: 1000;
}
.vfm--overlay {
  opacity: 0.4 !important;
}
.vfm--absolute {
  position: absolute;
}
.vfm--overlay {
  background-color: #00000080;
}
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.modal-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  background: #fff;
  transition: all 0.3s ease-in-out;
}
.modal__title {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal__title .title-left {
  flex: 1 1 0%;
  min-width: 0;
  align-items: center;
  font-weight: 700;
  font-size: 16px;
  line-height: 36px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
}
.modal__title .title {
  font-size: 24px;
  font-family: Inter;
  color: #111827;
  margin-right: 32px;
  white-space: nowrap;
  cursor: text;
}
.modal__title .title-right {
  display: flex;
  align-items: center;
  column-gap: 8px;
  justify-content: flex-end;
  white-space: nowrap;
  flex-shrink: 0;
}
.modal__content {
  flex: 1;
}
.shift-detail .container-content {
  padding: 20px;
}
.form-group:last-child {
  margin-bottom: 0;
}
.modal__footer__line {
  border-top: 1px solid #d5dfe2;
}
.modal__footer {
  display: flex;
  padding: 12px 20px;
  position: relative;
}
.shift-detail .footer-buttons-parent {
  width: 100%;
  justify-content: flex-end;
}
.shift-detail .footer-buttons {
  flex-direction: row-reverse;
  gap: 8px;
}
.icon-danger {
  mask-image: url("../assets/icons/pas.qtsx_icon-e5768799.svg");
  mask-repeat: no-repeat;
  mask-position: -249px -168px;
  background-color: #dc2626;
}
</style>
