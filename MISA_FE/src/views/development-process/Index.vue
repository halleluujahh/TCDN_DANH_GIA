<script setup>
import BasePageHeader from "@/components/base/BasePageHeader.vue";

const props = defineProps({
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

<style scoped></style>
