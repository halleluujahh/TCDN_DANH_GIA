<script setup>
import { useAppStore } from "../stores/appStore";
import AppContent from "./components/AppContent.vue";
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSidebar.vue";
const appStore = useAppStore();
</script>

<template>
  <div class="app-layout">
    <app-header />
    <div :class="['main']">
      <app-sidebar />
      <app-content>
        <router-view />
      </app-content>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  height: calc(100% - 48px);
  max-height: calc(100vh - 48px);
  width: 100% !important;
  transition: width 0.1s ease-in-out;
}
</style>
