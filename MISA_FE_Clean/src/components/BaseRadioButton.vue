<script setup lang="ts">
// @ts-ignore
import { defineProps, ref, defineEmits } from "vue";

/**
 * BaseRadioButton Component - Radio button tái sử dụng
 * Hỗ trợ nhiều lựa chọn với text và value
 * Created By hanv 02/02/2026
 */
interface BaseRadioButtonProps {
  // Thuộc tính input
  fieldName?: string;
  disabled?: boolean;
  pointer?: boolean;
  checkItems: Array<{
    text: string;
    value: string | number;
    isChecked: boolean;
  }>;
}
interface BaseRadioButtonEmits {
  (e: "handleChangeValue", value: string | number | null): void;
}
const props = defineProps<BaseRadioButtonProps>();
const emits = defineEmits<BaseRadioButtonEmits>();

</script>

<template>
  <div
    :class="[
      'flex-1',
      'flex',
      'items-center',
      'flex-row',
      'input-container',
      props.pointer ? 'pointer' : '',
      props.disabled ? 'disabled' : '',
    ]"
  >
    <label
      class="ms-radio mr-4"
      v-for="(item, index) in props.checkItems"
      :key="index"
    >
      <input
        type="radio"
        :disabled="props.disabled"
        :checked="item.isChecked"
        @click="emits('handleChangeValue', item.value)"
      />
      <div class="checkmark"></div>
      <div class="flex-column ms-radio-content">
        <div class="ms-radio--text">{{ item.text }}</div>
      </div>
    </label>
  </div>
</template>

<style scoped></style>
