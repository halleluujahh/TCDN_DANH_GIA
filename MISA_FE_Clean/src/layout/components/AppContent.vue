<script setup>
import { useAppStore } from "../../stores/app-store";

const appStore = useAppStore();
</script>

<template>
  <div
    :class="[
      'main-right',
      'flex-column',
      appStore.sidebarCollapsed ? 'main-right-full' : '',
    ]"
  >
    <div class="main-view flex flex-column">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.main-right {
  transition: padding 0.2s;
  background-color: #fff;
  width: calc(100% - 234px);
}
.main-right .main-view {
  height: 100%;
  background: #e5e7eb;
}
.main-right .main-view .development-page {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.main .main-right-full {
  width: calc(100% - 52px);
}
</style>
