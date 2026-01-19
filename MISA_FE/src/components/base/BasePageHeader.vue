<script setup>
/**
 * BasePageHeader - Header trang với tiêu đề
 */
const props = defineProps({
  // Tiêu đề trang
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="base-page-header flex-row">
    <!-- Page title -->
    <h1 class="page-title">{{ title }}</h1>

    <!-- Right side actions slot -->
    <div v-if="$slots.actions" class="header-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style scoped>
.base-page-header {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.base-page-header .page-title {
  font-size: 24px;
  font-weight: 700;
  font-family: Inter;
  color: #111827;
}
</style>
