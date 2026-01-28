<script setup lang="ts">
import BaseBtn from "./BaseBtn.vue";
import BaseInput from "./BaseInput.vue";
import { defineProps, defineEmits } from "vue";

interface DropdownProps {
  isClose: boolean;
  dropdownTitle?: string;
  style?: Record<string, string>;
}
interface DropdownEmits {
  (e: "close"): void;
}
const props = defineProps<DropdownProps>();
const emit = defineEmits<DropdownEmits>();
</script>

<template>
  <Teleport to="body">
    <div
      :style="props.style"
      v-if="!props.isClose"
      class="gap-container flex-column padding-vertial padding-horizontal condition-container text"
    >
      <div class="flex flex-between relative">
        <div class="column-filter-text">
          {{ props.dropdownTitle }}
        </div>
        <div class="close-condition-btn" @click="$emit('close')">
          <div class="ms-button btn-text-neutral only-icon">
            <div class="icon icon-close icon16"></div>
          </div>
        </div>
      </div>
      <div class="filter-container">
        <div class="control-gap-item view-fitler-text">
          <slot name="dropdown-body"></slot>
        </div>
      </div>
      <div class="buttons flex">
        <slot name="dropdown-footer"></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.condition-container {
  border: none;
  z-index: 1002;
  background: white;
  min-width: 350px;
  width: -moz-fit-content;
  width: fit-content;
  font-weight: 400;
  font-size: 13px;
  border-radius: 4px;
  box-shadow:
    0 0 8px #0000001a,
    0 8px 16px #0000001a;
}
.condition-container .column-filter-text {
  font-weight: 600;
  font-size: 16px;
  margin-right: 30px;
}
.condition-container .filter-container .view-fitler-text {
  text-align: left;
}
.control-gap-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.condition-container .filter-operator {
  width: 100%;
}
.condition-container .buttons {
  flex-direction: row-reverse;
}
.filter-value .ms-input div {
  width: 100%;
}
.filter-conditions {
  display: flex;
  align-items: center;
  row-gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  margin-right: 8px;
  max-height: 56px;
  overflow-y: auto;
}
.filter-conditions {
  margin-bottom: 0;
}
.filter-item {
  max-width: calc(100% - 8px);
}
.filter-conditions .filter-item {
  display: flex;
  gap: 8px;
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  position: relative;
  margin-right: 8px;
  white-space: normal;
  align-items: center;
  background-color: #f3f4f6;
}
.filter-conditions .lable-value-filter {
  display: flex;
  gap: 8px;
}
.filter-conditions .delete-all-filter {
  display: inline-block;
  color: #f06666;
  cursor: pointer;
  white-space: nowrap;
}
.icon-close {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -96px 0px;
  background-color: #4b5563 !important;
}
</style>
