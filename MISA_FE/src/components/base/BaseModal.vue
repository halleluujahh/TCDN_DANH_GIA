<script setup>
import { onMounted, onUpdated, ref, watch } from "vue";
import { useShortCut } from "../../composables/useShortCut";
import BaseBtn from "./BaseBtn.vue";
import BaseInput from "./BaseInput.vue";
import { some } from "lodash";
import { CONSTANTS } from "../../commons/constants";
import { cloneDeep } from "lodash";
import BaseModalError from "./BaseModalError.vue";

/**
 * BaseModal Component - Modal dialog draggable với form fields
 * Hỗ trợ: drag to move, form validation, keyboard shortcuts, error modal
 * Hỗ trợ shortcut: Ctrl+S (save), Ctrl+Shift+S (saveAdd), ESC (close)
 * Created By hanv 20/01/2026
 */

/**
 * Modal reference cho việc drag and positioning
 * @type {HTMLElement}
 */
const modalRef = ref(null);

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
let target = null;

/**
 * Bắt đầu drag modal
 * Lưu vị trí ban đầu của chuột và offset modal
 * Thêm mousemove và mouseup listeners
 * @param {MouseEvent} e - Mouse down event từ modal header
 * Created By hanv 20/01/2026
 */
function startDrag(e) {
  target = modalRef.value;
  isDragging = true;

  const rect = target.getBoundingClientRect();
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
function onDrag(e) {
  if (!isDragging) return;

  target.style.position = "fixed";
  target.style.left = e.clientX - shiftX + "px";
  target.style.top = e.clientY - shiftY + "px";
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
 * Props cho BaseModal component
 * Created By hanv 20/01/2026
 */
const props = defineProps({
  /**
   * Tiêu đề của modal
   * @type {String}
   */
  modalTitle: {
    type: String,
    default: "",
  },
  /**
   * Danh sách input fields cho form
   * Mỗi group có formItems array
   * @type {Array}
   */
  modalInputFields: {
    type: Array,
    default: () => [],
  },
  /**
   * Danh sách buttons ở footer
   * Mỗi button có: text, type, action, tooltipText
   * @type {Array}
   */
  buttonFooter: {
    type: Array,
    default: () => [],
  },
  /**
   * Trạng thái hiển thị modal
   * @type {Boolean}
   */
  isShowModal: {
    type: Boolean,
    default: false,
  },
  /**
   * ID của item đang chỉnh sửa (null nếu add new)
   * @type {String|Number|null}
   */
  idEdited: {
    type: [String, Number, null],
    default: null,
  },
  /**
   * Configuration cho error modal
   * Chứa: title, message, iconTitle, iconTooltip, buttonFooterModalError
   * @type {Object}
   */
  errorModal: {
    type: Object,
    default: () => ({}),
  },
});

/**
 * Clone buttonFooter để track changes
 * Created By hanv 20/01/2026
 */
const buttonFooterClone = ref(cloneDeep(props.buttonFooter));

/**
 * Watch buttonFooter prop để cập nhật clone
 * Created By hanv 20/01/2026
 */
watch(
  () => props.buttonFooter,
  (newVal) => {
    buttonFooterClone.value = newVal;
  },
  { deep: true, immediate: true },
);

/**
 * Define các events được emit từ component
 * - closeModal: Emit khi đóng modal
 * - action: Emit khi action button được click
 * - blur-action: Emit khi blur trên input field
 * Created By hanv 20/01/2026
 */
const emit = defineEmits(["closeModal", "action", "blur-action"]);

/**
 * Emit action từ footer button
 * @param {String} action - Tên action cần thực hiện
 * Created By hanv 20/01/2026
 */
function emitBtnFooterAction(action) {
  emit("action", action);
}

/**
 * Emit close modal event
 * Created By hanv 20/01/2026
 */
function closeModal() {
  emit("closeModal");
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
  emit("action", "save");
});
useShortCut("esc", () => {
  emit("closeModal");
});
</script>

<template>
  <div class="modal-container" v-if="props.isShowModal">
    <div class="vfm vfm--inset vfm--fixed shift-detail ms-dynamic-popup">
      <div class="vfm__overlay vfm--overlay vfm--absolute vfm--inset"></div>
      <div
        class="vfm__container vfm--absolute vfm--inset vfm--outline-none modal-container"
      >
        <div
          class="vfm__content modal-content"
          style="width: 680px; touch-action: none"
          ref="modalRef"
        >
          <div
            @mousedown="startDrag($event)"
            class="modal__title modal__drag cursor-move"
          >
            <div class="title-left">
              <div class="title">{{ props.modalTitle }}</div>
            </div>
            <div class="title-right">
              <BaseBtn
                icon="ic-help"
                type="outline-neutral"
                :is-hide-border="true"
                :icon-size="'icon20'"
                :is-no-padding="true"
                :tooltip-text="'Trợ giúp'"
              />
              <BaseBtn
                icon="close"
                type="outline-neutral"
                :is-hide-border="true"
                :icon-size="'icon20'"
                :is-no-padding="true"
                @click="closeModal"
                :tooltip-text="'Đóng (ESC)'"
              />
            </div>
          </div>
          <div class="subHeader"></div>
          <div class="modal__content flex-column flex1">
            <span
              class="popup-shortkey"
              shortkey="Close|Save|SaveAndAdd"
            ></span>
            <div class="container-content">
              <div
                v-for="(field, indexModalInputFields) in props.modalInputFields"
                :key="indexModalInputFields"
                :class="[
                  'form-group',
                  { flex: field.isFlex },
                  field.isCheckboxGroup ? 'gap-4' : '',
                ]"
              >
                <div
                  v-for="(fieldItems, indexFieldItems) in field.formItems"
                  :key="indexFieldItems"
                  :class="[
                    'ms-' + fieldItems.type,
                    fieldItems.type === CONSTANTS.BASE_INPUT_TYPE.CHECKBOX
                      ? ''
                      : 'ms-editor',
                    'w-100',
                    'flex',
                    'items-center',
                    'gap-4',
                    'ms-validate',
                    'mb-16px',
                    field.isFlex ? 'w-1-2 mr-3' : '',
                  ]"
                  style="height: auto"
                >
                  <div
                    v-if="
                      fieldItems.type !== CONSTANTS.BASE_INPUT_TYPE.CHECKBOX
                    "
                    class="flex items-center"
                  >
                    <label class="label">{{ fieldItems.label }}</label>
                    <div v-show="fieldItems.isRequired" class="ms-required">
                      &nbsp;*
                    </div>
                  </div>
                  <div
                    v-else-if="
                      fieldItems.type === CONSTANTS.BASE_INPUT_TYPE.CHECKBOX &&
                      props.idEdited !== null
                    "
                    class="flex items-center"
                  >
                    <label class="label">{{ fieldItems.label }}</label>
                    <div v-show="fieldItems.isRequired" class="ms-required">
                      &nbsp;*
                    </div>
                  </div>
                  <BaseInput
                    v-if="
                      fieldItems.type !== CONSTANTS.BASE_INPUT_TYPE.CHECKBOX
                    "
                    :type="fieldItems.type"
                    :autoComplete="
                      fieldItems.autoComplete !== undefined
                        ? fieldItems.autoComplete
                        : 'off'
                    "
                    :icon="fieldItems.icon !== undefined ? fieldItems.icon : ''"
                    :max-length="
                      fieldItems.maxLength !== undefined
                        ? fieldItems.maxLength
                        : null
                    "
                    :is-disabled="
                      fieldItems.isDisabled !== undefined
                        ? fieldItems.isDisabled
                        : false
                    "
                    :errorMessage="fieldItems.errorMessage"
                    :isValueNegative="fieldItems.isValueNegative"
                    :checkItems="
                      fieldItems.checkItems !== undefined
                        ? fieldItems.checkItems
                        : []
                    "
                    :action="
                      fieldItems.action !== undefined ? fieldItems.action : null
                    "
                    :indexModalInputFields="indexModalInputFields"
                    :indexFieldItems="indexFieldItems"
                    v-model="fieldItems.value"
                    @blur-action="emit('blur-action', indexFieldItems, indexModalInputFields)"
                  />
                  <BaseInput
                    v-else-if="
                      fieldItems.type === CONSTANTS.BASE_INPUT_TYPE.CHECKBOX &&
                      props.idEdited !== null
                    "
                    :type="fieldItems.type"
                    :autoComplete="
                      fieldItems.autoComplete !== undefined
                        ? fieldItems.autoComplete
                        : 'off'
                    "
                    :icon="fieldItems.icon !== undefined ? fieldItems.icon : ''"
                    :max-length="
                      fieldItems.maxLength !== undefined
                        ? fieldItems.maxLength
                        : null
                    "
                    :is-disabled="
                      fieldItems.isDisabled !== undefined
                        ? fieldItems.isDisabled
                        : false
                    "
                    :errorMessage="fieldItems.errorMessage"
                    :checkItems="
                      fieldItems.checkItems !== undefined
                        ? fieldItems.checkItems
                        : []
                    "
                    :action="
                      fieldItems.action !== undefined ? fieldItems.action : null
                    "
                    :indexModalInputFields="indexModalInputFields"
                    :indexFieldItems="indexFieldItems"
                    v-model="fieldItems.value"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal__footer__line"></div>
          <div class="modal__footer">
            <div class="flex footer-buttons-parent">
              <div class="flex footer-buttons-right footer-buttons">
                <BaseBtn
                  v-for="(buttonItems, indexBtn) in buttonFooterClone"
                  :key="indexBtn"
                  :text="buttonItems.text"
                  :tooltipText="buttonItems.tooltipText"
                  :type="buttonItems.type"
                  v-on:click="emitBtnFooterAction(buttonItems.action)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BaseModalError
      :iconTitle="props.errorModal.iconTitle"
      :title="props.errorModal.title"
      :message="props.errorModal.message"
      :iconTooltip="props.errorModal.iconTooltip"
      :footerButtons="props.errorModal.buttonFooterModalError"
      @action="emitBtnFooterAction"
    />
  </div>
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
.vfm--inset {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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
</style>
