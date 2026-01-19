<script setup>
import BaseSidebar from "../../components/base/BaseSidebar.vue";
import { useAppStore } from "../../stores/appStore";

const appStore = useAppStore();
</script>

<template>
  <BaseSidebar
    :menu-items="appStore.sidebarItems"
    @toggleSubMenuItem="toggleSubMenuItem"
    @onMouseEnterPopupMenuOutside="onMouseEnterPopupMenuOutside"
    @onMouseEnterPopupMenuInside="onMouseEnterPopupMenuInside"
    @onMouseLeavePopupMenuOutside="onMouseLeavePopupMenuOutside"
    @onMouseLeavePopupMenuInside="onMouseLeavePopupMenuInside"
    @isActive="isActive"
  />
</template>

<style scoped></style>
