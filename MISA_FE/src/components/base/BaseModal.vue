<script setup>
import { onMounted, onUpdated, ref, watch } from "vue";
import { useShortCut } from "../../composables/useShortCut";
import BaseBtn from "./BaseBtn.vue";
import BaseInput from "./BaseInput.vue";
import { some } from "lodash";
import { CONSTANTS } from "../../commons/constants";
import { cloneDeep } from "lodash";
import BaseModalError from "./BaseModalError.vue";

const modalRef = ref(null);

// Drag variables
let isDragging = false;
let shiftX = 0;
let shiftY = 0;
let target = null;

// Drag functions
function startDrag(e) {
  target = modalRef.value;
  isDragging = true;

  const rect = target.getBoundingClientRect();
  shiftX = e.clientX - rect.left;
  shiftY = e.clientY - rect.top;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}

// Move modal
function onDrag(e) {
  if (!isDragging) return;

  target.style.position = "fixed";
  target.style.left = e.clientX - shiftX + "px";
  target.style.top = e.clientY - shiftY + "px";
}

// Stop dragging
function stopDrag() {
  isDragging = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
}
// Props
const props = defineProps({
  modalTitle: {
    type: String,
    default: "",
  },
  modalInputFields: {
    type: Array,
    default: () => [],
  },
  buttonFooter: {
    type: Array,
    default: () => [],
  },
  isShowModal: {
    type: Boolean,
    default: false,
  },
  idEdited: {
    type: [String, Number, null],
    default: null,
  },
  errorModal: {
    type: Object,
    default: () => ({}),
  },
});
const buttonFooterClone = ref(cloneDeep(props.buttonFooter));
watch(
  () => props.buttonFooter,
  (newVal) => {
    buttonFooterClone.value = newVal;
  },
  { deep: true, immediate: true },
);
// Emits
const emit = defineEmits(["closeModal", "action"]);
// Emit functions
function emitBtnFooterAction(action) {
  emit("action", action);
}
function closeModal() {
  emit("closeModal");
}

// Shortcuts
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
