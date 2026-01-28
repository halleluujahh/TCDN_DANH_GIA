<script setup lang="ts">
// @ts-ignore
import { onMounted, ref } from "vue";
import type { Pagination } from "../../types/ui/pagination";
import shiftStore from "../../stores/shift-store";
import ShiftTable from "./components/ShiftTable.vue";
import type { Shift } from "../../types/models/shift/shift";
import type { FilterDTO } from "../../types/DTO/shift/filter-dto";

/**
 * Store ca làm việc
 */
const shiftStoreInstance = shiftStore();

/**
 * Gọi API lấy danh sách ca làm việc
 */
const getAllShifts = async (pagination: Pagination) => {
  await shiftStoreInstance.loadShifts({
    currentPage: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });
};
const getAllShiftsWithFilter = async (
  pagination: Pagination,
  filter: FilterDTO,
) => {
  await shiftStoreInstance.loadShiftsWithFilter({
    currentPage: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filter: filter || {},
  });
};
/**
 * Khi component được mounted,
 * gọi hàm lấy danh sách ca làm việc
 */
onMounted(() => {
  getAllShifts({ pageIndex: 0, pageSize: 10 });
});
</script>
<template>
  <div>
    <ShiftTable
      :loading="shiftStoreInstance.loading"
      @filter-change="getAllShiftsWithFilter"
    />
  </div>
</template>
<style scoped></style>
