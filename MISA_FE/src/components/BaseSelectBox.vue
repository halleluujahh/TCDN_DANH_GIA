<script setup>
const props = defineProps({
  style: {
    type: Object,
    default: () => {},
  },
  items: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["action"]);
</script>

<template>
  <ul class="menu-wrapper-menu widget-more-container" :style="style">
    <div v-for="(item, indexItem) in items" :key="`item-${indexItem}`">
      <li
        class="menu-wrapper-item flex menu-wrapper-item-icon menu-item-feture"
        @click="
          emit(
            'action',
            item.action,
            item.shiftUpdated ? item.shiftUpdated : null,
            item.idxTbdItem,
            null,
            null,
            item.sortType
          )
        "
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
  mask-image: url("../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -224px 0px;
  background-color: #4b5563;
}
.icon-empty {
  mask-image: url("../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -176px 0px;
  background-color: #4b5563;
}
.icon-trash {
  mask-image: url("../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -208px 0px;
  background-color: #dc2626 !important;
}
.icon-arrow-up {
  mask-image: url("../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -512px 0px;
  background-color: #4b5563 !important;
}
.icon-arrow-down {
  mask-image: url("../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -528px 0px;
  background-color: #4b5563 !important;
}
.icon-pin {
  mask-image: url("../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -432px 0px;
  background-color: #4b5563 !important;
}
.icon-unpin {
  mask-image: url("../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -592px 0px;
  background-color: #4b5563 !important;
}
</style>
