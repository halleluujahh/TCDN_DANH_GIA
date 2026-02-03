<script setup lang="ts">
import type { Shift } from "../types/models/shift/shift";
// @ts-ignore
import { defineProps, defineEmits } from "vue";
import type { TableRow } from "../types/ui/table-row";

/**
 * BaseSelectBox Component - Menu select box tái sử dụng
 * Hiển thị danh sách menu items với icon, text và action
 * Hỗ trợ phân tách menu items bằng border
 * Created By hanv 20/01/2026
 */

interface BaseSelectboxProps {
  /**
   * Style object cho wrapper
   * @type {Object}
   * Created By hanv 02/02/2026
   */
  style?: Record<string, string>;

  /**
   * Danh sách menu items
   * @type {Array}
   * Created By hanv 02/02/2026
   */
  selectBoxItems: Array<{
    text: string;
    value: any;
    icon: string;
    isHasMenuBorder?: boolean;
  }>;
  isOpen: boolean;
}
interface BaseSelectboxEmits {
  (e: "close"): void;
  (e: "select", value: any): void;
}
const props = defineProps<BaseSelectboxProps>();
const emit = defineEmits<BaseSelectboxEmits>();

/**
 * Xử lý thay đổi giá trị selectbox
 * @param {String | Number} value - Giá trị được chọn
 * Created By hanv 02/02/2026
 */
const handleChange = (item: any) => {
  if (item !== undefined && item !== null) {
    emit("select", item);
    emit("close");
  }
};
</script>

<template>
  <ul
    class="menu-wrapper-menu widget-more-container"
    :style="style"
    v-if="isOpen"
  >
    <div v-for="(item, indexItem) in selectBoxItems" :key="`item-${indexItem}`">
      <li
        class="menu-wrapper-item flex menu-wrapper-item-icon menu-item-feture"
        @click="handleChange(item)"
      >
        <div
          :class="['icon16', 'menu-item-ic', 'icon16', `icon-${item.icon}`]"
        ></div>
        <div class="menu-item-content">
          <span>{{ item.text }}</span>
        </div>
      </li>
      <div v-if="item.isHasMenuBorder" class="menu-border"></div>
    </div>
  </ul>
</template>

<style scoped>
.menu-wrapper-menu {
  list-style: none;
  animation: slide-down 0.2s ease;
  position: absolute;
  z-index: 9999;
  background-color: #fff;
  box-shadow:
    0 0 8px #0000001a,
    0 8px 16px #0000001a;
  border-radius: 4px;
  margin: 0;
}
.menu-wrapper-item {
  outline: none;
  padding: 8px 12px;
  color: inherit;
  text-decoration: none;
  height: 32px;
  cursor: pointer;
  display: block;
  transition: all 0.7s ease;
  display: flex;
  column-gap: 8px;
}
.menu-border {
  position: relative;
  display: flex;
  margin: 8px 12px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  height: 1px;
  background: #d1d5db;
}
.menu-wrapper-item:hover {
  outline: 0;
  background-color: #f3f4f6;
  border-radius: 2px;
  transition: all 0.2s ease;
}
.menu-wrapper-item.flex {
  display: flex !important;
}
.menu-wrapper-item.menu-wrapper-item-icon {
  white-space: nowrap;
  align-items: center;
}
.icon-duplicate {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -224px 0px;
  background-color: #4b5563;
}
.icon-empty {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -176px 0px;
  background-color: #4b5563;
}
.icon-trash {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -208px 0px;
  background-color: #dc2626 !important;
}
.icon-arrow-up {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -512px 0px;
  background-color: #4b5563 !important;
}
.icon-arrow-down {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -528px 0px;
  background-color: #4b5563 !important;
}
.icon-pin {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -432px 0px;
  background-color: #4b5563 !important;
}
.icon-unpin {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -592px 0px;
  background-color: #4b5563 !important;
}
</style>
