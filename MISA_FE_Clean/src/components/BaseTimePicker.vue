<script setup lang="ts">
// @ts-ignore
import { defineProps, defineModel, ref, computed, watch } from "vue";
import {
  formatTime,
  formatTimeAlwaysValid,
} from "../composables/common/use-timepicker";

interface BaseTimePickerProps {
  // Thuộc tính input
  fieldName: string;
  placeholder?: string;
  disabled?: boolean;
  pointer?: boolean;
  readonly?: boolean;
  required?: boolean;
  maxlength?: number;
  minlength?: number;
  autocomplete?: string;
  tooltip?: string;
  // lỗi
  error?: string;
  // icon
  icon?: string;
  iconSize?: string | "icon16";
}

const props = defineProps<BaseTimePickerProps>();

const modelValue = defineModel<string | number | null>();

const errorMessage = ref(props.error !== undefined ? props.error : "");

/**
 * Validate trống khi blur
 * @param event
 */
function validateBlank(event: FocusEvent) {
  const target = event.target as HTMLInputElement;
  target.value = target.value.trim();
  if (!target.value && props.required) {
    errorMessage.value = `${props.fieldName} không được để trống`;
  } else {
    errorMessage.value = "";
  }
}

/**
 * Validate và format time value
 * Format HH:MM tự động khi input hoặc blur
 * @param {String} event - Loại event (input hoặc blur)
 * Created By hanv 20/01/2026
 */
function handleValidAndCalculateTime(event: string, e?: FocusEvent) {
  if (event === "input") {
    //@ts-ignore
    modelValue.value = formatTime(modelValue.value as string | number | null);
  } else if (event === "blur") {
    //@ts-ignore
    modelValue.value = formatTimeAlwaysValid(
      modelValue.value as string | number | null,
    );
    if (props.required) {
      validateBlank(e!);
    }
  }
}

const isHasError = computed(() => {
  return errorMessage.value !== "";
});

watch(
  () => props.error,
  (newVal) => {
    errorMessage.value = newVal || "";
  },
  {
    deep: true,
  },
);
</script>

<template>
  <div
    :class="[
      'flex-1',
      'flex',
      'items-center',
      'input-container',
      isHasError ? 'error' : '',
      'border',
      props.pointer ? 'pointer' : '',
      'ms-container--timepicker flex-row',
      props.disabled ? 'disabled' : '',
    ]"
    v-tooltip="errorMessage || props.tooltip"
  >
    <div :class="['flex-1', 'flex']">
      <input
        type="text"
        placeholder="HH:MM"
        class="ms-input--timepicker flex"
        v-model="modelValue"
        @input="handleValidAndCalculateTime('input', $event)"
        @blur="handleValidAndCalculateTime('blur', $event)"
      />
      <div
        :class="[props.iconSize, props.icon, props.icon ? '' : 'd-none']"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.ic-time {
  mask-image: url("/src/assets/icons/pas.ic_time-af72a219.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
}
</style>
