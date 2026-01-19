<script setup>
import { defineEmits, onBeforeMount, onUpdated } from "vue";

const props = defineProps({
  // add-white, inactive, trash, reload, pencil, feature-more-blue, step-backward, angle-left, angle-right, step-forward
  icon: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "solid-brand",
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isHideBorder: {
    type: Boolean,
    default: false,
  },
  isBtnActionTable: {
    type: Boolean,
    default: false,
  },
  isBtnPagination: {
    type: Boolean,
    default: false,
  },
  tooltipText: {
    type: String,
    default: "",
  },
  iconSize: {
    type: String,
    default: "icon16",
  },
  paddingTextIcon: {
    type: String,
    default: "pl-1",
  },
  isNoPadding: {
    type: Boolean,
    default: false,
  },
});

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
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: -80px 0px;
  background-color: #fff;
}
.inactive {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -176px 0px;
  background-color: #dc2626 !important;
}
.trash {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -208px 0px;
  background-color: #dc2626 !important;
}
.reload {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -112px 0px;
  background-color: #4b5563;
}
.pencil {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -271px 0px;
  background-color: #4b5563;
}
.pencil:hover {
  background-color: #009b71;
}
.feature-more-blue {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -288px 0px;
  background-color: #4b5563;
}
.feature-more-blue:hover {
  background-color: #009b71;
}
.step-backward {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -143px 0px;
  background-color: #4b5563;
}
.angle-left {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -48px 0px;
  background-color: #4b5563;
}
.angle-right {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -64px 0px;
  background-color: #4b5563;
}
.step-forward {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -160px 0px;
  background-color: #4b5563;
}
.ic-help {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -279px -16px;
  background-color: #4b5563;
}
.close {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -299px -16px;
  background-color: #4b5563;
}
.active {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
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
.bg-pagination{
  background: #f3f4f6;
}
</style>
