<script setup>
import BasePageHeader from "@/components/base/BasePageHeader.vue";

/**
 * DevelopmentView - Trang phát triển (placeholder)
 * Hiển thị message chỉ báo tính năng đang trong quá trình phát triển
 * Created By hanv 20/01/2026
 */

const props = defineProps({
  /**
   * Tiêu đề trang
   * @type {String}
   */
  title: {
    type: String,
  },
});
</script>

<template>
  <div class="development-page">
    <BasePageHeader :title="title" />
    <div class="content">
      <div class="message">
        <i class="icon-info"></i>
        <p>Tính năng đang trong quá trình phát triển</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
