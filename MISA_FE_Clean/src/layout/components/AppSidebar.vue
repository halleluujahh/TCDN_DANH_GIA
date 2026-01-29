<script setup>
import BaseSidebar from "../../components/BaseSidebar.vue";
import { useAppStore } from "../../stores/app-store";
const appStore = useAppStore();
</script>

<template>
  <BaseSidebar
    :menu-items="appStore.sidebarItems"
    :sidebar-collapsed="appStore.sidebarCollapsed"
  />
</template>

<style scoped></style>
