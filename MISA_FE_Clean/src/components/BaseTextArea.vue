<script setup lang="ts">
// @ts-ignore
import { defineProps, defineModel, ref, computed, watch } from "vue";

interface BaseTextAreaProps {
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
  rows: number;
  // lỗi
  error?: string;
}

const props = defineProps<BaseTextAreaProps>();

const modelValue = defineModel<string | number | null>();

const errorMessage = ref(props.error !== undefined ? props.error : "");

/**
 * Kiểm tra và xử lý trống
 * @param event
 */
const handleBlur = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement;
  target.value = target.value.trim();
  if (!target.value) {
    errorMessage.value = `${props.fieldName} không được để trống`;
  }
};

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
      'flex-row',
      isHasError ? 'error' : '',
      'border',
      props.pointer ? 'pointer' : '',
      props.disabled ? 'disabled' : '',
    ]"
    v-tooltip="errorMessage || props.tooltip"
  >
    <div :class="['flex-1', 'flex', 'w-full']">
      <textarea
        :autocomplete="props.autocomplete"
        :maxlength="props.maxlength"
        :minlength="props.minlength"
        :rows="props.rows"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        class="ms-textarea-item flex w-full outline-none"
        v-model="modelValue"
        @blur="props.required && handleBlur($event)"
      ></textarea>
    </div>
  </div>
</template>

<style scoped></style>
