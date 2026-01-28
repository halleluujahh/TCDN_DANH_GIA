<script setup>
import AppContent from "./components/AppContent.vue";
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSidebar.vue";
</script>

<template>
  <div class="app-layout">
    <app-header />
    <div class="main">
      <app-sidebar />
      <app-content>
        <router-view />
      </app-content>
    </div>
  </div>
</template>

<style>
/* Global styles  */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
@import "../assets/styles/style.css";
@import "../assets/styles/common.css";

.main {
  display: flex;
  height: calc(100% - 48px);
  max-height: calc(100vh - 48px);
  width: 100% !important;
  transition: width 0.1s ease-in-out;
}
</style>
