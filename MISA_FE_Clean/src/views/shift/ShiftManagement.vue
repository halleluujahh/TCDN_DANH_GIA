<script setup lang="ts">
// @ts-ignore
import { onMounted, ref, watch } from "vue";
import type { Pagination } from "../../types/ui/pagination";
import shiftStore from "../../stores/shift-store";
import ShiftTable from "./components/ShiftTable.vue";
import type { Shift } from "../../types/models/shift/shift";
import type { FilterDTO } from "../../types/DTO/shift/filter-dto";
import type { ColumnFilterModal } from "../../types/ui/column-filter-modal";
import { useShiftTable } from "../../composables/shift/use-shift-table";
import type { ColumnSort } from "../../types/ui/column-sort";
import type { TableColumn } from "../../types/ui/table-column";

/**
 * Store ca làm việc
 */
const shiftStoreInstance = shiftStore();

// =====================COMPOSABLES START=======================
/**
 * Sử dụng các hàm trong useShiftTable
 */
const { mapSortArrayToFilterDTOFunc, mapFilterArrayToFilterDTOFunc } =
  useShiftTable();
// =====================COMPOSABLES END=======================

// =====================REACTIVITY START========================
/**
 * Để lưu các hàng của bảng ca làm việc được chọn
 */
const idsSelected = ref<Set<string>>(new Set<string>());

/**
 * Phân trang danh sách ca làm việc
 */
const pagination = ref<Pagination>({
  pageIndex: 0, // Trang hiện tại
  pageSize: 10, // Số bản ghi trên mỗi trang
  totalRecords: 0, // Tổng số bản ghi
  totalPages: 0, // Tổng số trang
});

/**
 * Bộ lọc danh sách ca làm việc
 */
const filterDTORef = ref<FilterDTO>({
  searchKeyword: "",
  filterByShiftColumn: [],
});
// =====================REACTIVITY END========================

// =====================METHODS START========================
/**
 * Xử lý khi người dùng chọn hoặc bỏ chọn một hàng
 * @param row
 */
const handleToggleCheck = (row: any) => {
  const id = row.key;
  if (idsSelected.value.has(id)) {
    idsSelected.value.delete(id);
  } else {
    idsSelected.value.add(id);
  }
};
/**
 * Xử lý khi người dùng chọn hoặc bỏ chọn tất cả
 * các hàng trong bảng
 * @param rows
 */
const handleToggleCheckAll = (rows: any[]) => {
  const allSelected = rows.every((row) => idsSelected.value.has(row.key));
  if (allSelected) {
    rows.forEach((row) => idsSelected.value.delete(row.key));
  } else {
    rows.forEach((row) => idsSelected.value.add(row.key));
  }
};
/**
 * Gọi API lấy danh sách ca làm việc
 */
const getAllShifts = async (pagination: Pagination) => {
  await shiftStoreInstance.loadShifts({
    currentPage: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });
};
/**
 * Gọi API lấy danh sách ca làm việc với bộ lọc
 * @param pagination
 * @param filter
 */
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
 * Xử lý khi có thay đổi bộ lọc
 * @param filterArrayRef
 */
const handleFilterChange = (filterArrayRef: ColumnFilterModal[]) => {
  if (filterArrayRef.length === 0) {
    filterDTORef.value.filterByShiftColumn = [];
  } else {
    mapFilterArrayToFilterDTOFunc(filterArrayRef, filterDTORef.value);
  }
};
/**
 * Xử lý khi có thay đổi tùy chọn nhóm
 * @param sortArrayRef
 * @param table
 */
const handleGroupOptionChange = (
  sortArrayRef: ColumnSort[],
  table: TableColumn<Shift>[],
) => {
  mapSortArrayToFilterDTOFunc(sortArrayRef, filterDTORef.value, table);
};
/**
 * Xử lý khi có thay đổi từ khóa tìm kiếm
 * @param searchKeyword
 */
const handleChangeSearchKeyword = (searchKeyword: string) => {
  console.log("searchKeyword", searchKeyword);
  filterDTORef.value.searchKeyword = searchKeyword;
};
/**
 * Xử lý khi bỏ chọn tất cả
 */
const handleUnSelectedAll = () => {
  idsSelected.value.clear();
};
/**
 * Xử lý khi kích hoạt nhiều ca làm việc
 */
const handleActiveMultiple = () => {
  shiftStoreInstance.activeMultipleShifts(idsSelected.value);
};
/**
 * Xử lý khi hủy kích hoạt nhiều ca làm việc
 */
const handleInactiveMultiple = () => {
  shiftStoreInstance.inactiveMultipleShifts(idsSelected.value);
};
/**
 * Xử lý khi xóa nhiều ca làm việc
 */
const handleDeleteMultiple = () => {
  shiftStoreInstance.deleteMultipleShifts(idsSelected.value);
};
/**
 * Xử lý lấy lại dữ liệu
 */
const handleReloadData = () => {
  pagination.value.pageIndex = 0;
  pagination.value.pageSize = 10;
  filterDTORef.value = {
    searchKeyword: "",
    filterByShiftColumn: [],
  };
};
// =====================METHODS END========================

// =====================WATCH START=====================
/**
 * Watch thay đổi mảng lọc cột
 */
watch(
  () => filterDTORef.value,
  (newFilterDTO) => {
    getAllShiftsWithFilter(pagination.value, newFilterDTO);
  },
  {
    deep: true,
  },
);
// =====================WATCH END=====================

/**
 * Khi component được mounted,
 * gọi hàm lấy danh sách ca làm việc
 */
onMounted(() => {
  getAllShifts({
    pageIndex: pagination.value.pageIndex,
    pageSize: pagination.value.pageSize,
  });
});
</script>
<template>
  <div>
    <ShiftTable
      :loading="shiftStoreInstance.loading"
      :ids-selected="idsSelected"
      :filterDTO="filterDTORef"
      @toggle-check="handleToggleCheck"
      @toggle-check-all="handleToggleCheckAll"
      @filter-change="handleFilterChange"
      @group-option-change="handleGroupOptionChange"
      @change-search-keyword="handleChangeSearchKeyword"
      @un-selected-all="handleUnSelectedAll"
      @active-multiple="handleActiveMultiple"
      @inactive-multiple="handleInactiveMultiple"
      @delete-multiple="handleDeleteMultiple"
      @reload-data="handleReloadData"
    />
  </div>
</template>
<style scoped></style>
