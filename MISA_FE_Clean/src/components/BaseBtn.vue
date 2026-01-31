<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

/**
 * BaseBtn Component - Nút bấm tái sử dụng với nhiều kiểu và trạng thái
 * Hỗ trợ icon, text, disabled state, tooltip, và các kiểu button khác nhau
 * Emit click event khi người dùng nhấn nút
 * Created By hanv 20/01/2026
 */

const props = defineProps({
  // add-white, inactive, trash, reload, pencil, feature-more-blue, step-backward, angle-left, angle-right, step-forward
  /**
   * Tên icon sử dụng (các kiểu: add-white, trash, reload, pencil, etc.)
   * @type {String}
   */
  icon: {
    type: String,
    default: "",
  },
  /**
   * Text hiển thị trên nút
   * @type {String}
   */
  text: {
    type: String,
    default: "",
  },
  /**
   * Kiểu button (solid-brand, outline-neutral, outline-danger, etc.)
   * @type {String}
   */
  type: {
    type: String,
    default: "solid-brand",
  },
  /**
   * Trạng thái disabled của nút
   * @type {Boolean}
   */
  isDisabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Ẩn border của nút
   * @type {Boolean}
   */
  isHideBorder: {
    type: Boolean,
    default: false,
  },
  /**
   * Kiểu nút hành động trong bảng
   * @type {Boolean}
   */
  isBtnActionTable: {
    type: Boolean,
    default: false,
  },
  /**
   * Kiểu nút phân trang
   * @type {Boolean}
   */
  isBtnPagination: {
    type: Boolean,
    default: false,
  },
  /**
   * Tooltip text hiển thị khi hover nút
   * @type {String}
   */
  tooltipText: {
    type: String,
    default: "",
  },
  /**
   * Kích thước icon (icon16, icon20, icon24)
   * @type {String}
   */
  iconSize: {
    type: String,
    default: "icon16",
  },
  /**
   * Padding giữa icon và text
   * @type {String}
   */
  paddingTextIcon: {
    type: String,
    default: "pl-1",
  },
  /**
   * Bỏ padding mặc định của nút
   * @type {Boolean}
   */
  isNoPadding: {
    type: Boolean,
    default: false,
  },
});

/**
 * Emit click event khi người dùng nhấn nút
 * @event click
 */
const emit = defineEmits(["click"]);
</script>

<template>
  <span>
    <button
      :class="[
        'ms-button',
        { 'only-icon': !props.text },
        { 'no-padding': props.isNoPadding },
        `btn-${props.type}`,
        { 'disabled-opacity': props.isDisabled },
        { 'bordered-btn-hide': props.isHideBorder },
        { 'feature-btn': props.isBtnActionTable },
        { 'bg-pagination': props.isBtnPagination },
      ]"
      :disabled="props.isDisabled"
      v-tooltip="props.tooltipText"
      v-on:click="emit('click', $event)"
    >
      <div
        :class="[
          'icon',
          props.iconSize,
          props.icon,
          props.icon ? '' : 'd-none',
        ]"
      ></div>
      <div
        :class="[
          'text',
          props.icon ? props.paddingTextIcon : '',
          'no-wrap',
          props.text ? '' : 'd-none',
        ]"
      >
        {{ props.text }}
      </div>
    </button>
  </span>
</template>

<style scoped>
.add-white {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: -80px 0px;
  background-color: #fff;
}
.inactive {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -176px 0px;
  background-color: #dc2626 !important;
}
.trash {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -208px 0px;
  background-color: #dc2626 !important;
}
.reload {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -112px 0px;
  background-color: #4b5563;
}
.pencil {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -271px 0px;
  background-color: #4b5563;
}
.pencil:hover {
  background-color: #009b71;
}
.feature-more-blue {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -288px 0px;
  background-color: #4b5563;
}
.feature-more-blue:hover {
  background-color: #009b71;
}
.step-backward {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -143px 0px;
  background-color: #4b5563;
}
.angle-left {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -48px 0px;
  background-color: #4b5563;
}
.angle-right {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -64px 0px;
  background-color: #4b5563;
}
.step-forward {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -160px 0px;
  background-color: #4b5563;
}
.ic-help {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -279px -16px;
  background-color: #4b5563;
}
.close {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -299px -16px;
  background-color: #4b5563;
}
.active {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -192px 0px;
  background-color: #16a34a;
}
.text {
  font-weight: 500;
}
.ms-button.only-icon {
  padding: 6px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ms-button.only-icon.no-padding {
  padding: 0px;
}
.bordered-btn-hide {
  border: none;
}
.feature-btn {
  cursor: pointer;
  transition: all ease 0.1s;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}
.bg-pagination {
  background: #f3f4f6;
}
.icon-close {
  mask-image: url("../assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -96px 0px;
  background-color: #4b5563 !important;
}
</style>
