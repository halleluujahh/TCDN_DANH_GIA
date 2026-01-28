<script setup lang="ts">
import { defineProps, ref, defineModel, computed } from "vue";
import { CONSTANTS } from "../constants/common";

interface BaseInputProps {
  // Thuộc tính input
  fieldName?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  maxlength?: number;
  minlength?: number;
  autocomplete?: string;
  // lỗi
  error?: string;
  // icon
  icon?: string;
  iconSize?: string | "icon16";
  iconPosition?: "left" | "right";
}

const props = defineProps<BaseInputProps>();

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
</script>

<template>
  <div
    :class="[
      'flex-1',
      'flex',
      'flex-row',
      'items-center',
      'input-container',
      'border',
      isHasError ? 'error' : '',
      props.disabled ? 'disabled' : '',
    ]"
    v-tooltip="errorMessage || props.placeholder"
  >
    <div :class="['flex-1', 'flex']">
      <div
        v-if="props.iconPosition === 'left'"
        :class="[
          props.iconSize,
          props.icon,
          'icon',
          'left',
          props.icon ? '' : 'd-none',
        ]"
      ></div>
      <input
        type="text"
        :autocomplete="props.autocomplete"
        :maxlength="props.maxlength"
        :minlength="props.minlength"
        :placeholder="props.placeholder"
        class="ms-input-item flex w-100"
        v-model="modelValue"
        @blur="props.required && handleBlur($event)"
      />
      <div
        v-if="props.iconPosition === 'right'"
        :class="[
          props.iconSize,
          props.icon,
          'icon',
          'right',
          props.icon ? '' : 'd-none',
        ]"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.search {
  mask-image: url("/src/assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: 0px 0px;
}
.ic-time {
  mask-image: url("/src/assets/icons/pas.ic_time-af72a219.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
}
.left {
  margin: 0 8px 0 0;
}
</style>
