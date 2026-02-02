<script setup lang="ts">
// @ts-ignore
import { computed, onMounted, ref, watch } from "vue";
import type { Pagination } from "../../types/ui/pagination";
import shiftStore from "../../stores/shift-store";
// @ts-ignore
import ShiftTable from "./components/ShiftTable.vue";
import type { Shift } from "../../types/models/shift/shift";
import type { FilterDTO } from "../../types/DTO/shift/filter-dto";
import type { ColumnFilterModal } from "../../types/ui/column-filter-modal";
import { useShiftTable } from "../../composables/shift/use-shift-table";
import type { ColumnSort } from "../../types/ui/column-sort";
import type { TableColumn } from "../../types/ui/table-column";
// @ts-ignore
import BasePageHeader from "../../components/BasePageHeader.vue";
// @ts-ignore
import BaseBtn from "../../components/BaseBtn.vue";
// @ts-ignore
import BaseModal from "../../components/BaseModal.vue";
// @ts-ignore
import ShiftForm from "./components/ShiftForm.vue";
import type { FormData } from "../../types/ui/form";
import { CONSTANTS } from "../../constants/common";
import type { TableRow } from "../../types/ui/table-row";

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
const paginationRef = ref<Pagination>({
  pageIndex: 0, // Trang hiện tại
  pageSize: 10, // Số bản ghi trên mỗi trang
  totalRecords: 0, // Tổng số bản ghi
  totalPages: 0, // Tổng số trang
  itemPerPageOptions: [
    {
      text: "10",
      value: 10,
    },
    {
      text: "20",
      value: 20,
    },
    {
      text: "50",
      value: 50,
    },
    {
      text: "100",
      value: 100,
    },
  ], // Các tùy chọn số bản ghi trên mỗi trang
});

/**
 * Bộ lọc danh sách ca làm việc
 */
const filterDTORef = ref<FilterDTO>({
  searchKeyword: "",
  filterByShiftColumn: [],
});
/**
 * Modal thêm/chỉnh sửa ca làm việc
 */
const shiftModalRef = ref({
  // Thuộc tính modal
  isClose: true,
  modalTitle: "Thêm ca làm việc",
  isDrag: true,
  style: { width: "680px", touchAction: "none" },
  row: null as TableRow<Shift> | null,
});
/**
 * Ref form ca làm việc
 */
const shiftFormRef = ref<InstanceType<typeof ShiftForm> | null>(null);
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
  paginationRef.value.totalRecords = shiftStoreInstance.totalItems;
  paginationRef.value.totalPages = Math.ceil(
    paginationRef.value.totalRecords / paginationRef.value.pageSize,
  );
};
/**
 * Gọi API lấy danh sách ca làm việc với bộ lọc
 * @param pagination
 * @param filter
 */
const getAllShiftsWithFilter = async (
  pagination: {
    pageIndex: number;
    pageSize: number;
  },
  filter: FilterDTO,
) => {
  await shiftStoreInstance.loadShiftsWithFilter({
    currentPage: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filter: filter || {},
  });
  paginationRef.value.totalRecords = shiftStoreInstance.totalItems;
  paginationRef.value.totalPages = Math.ceil(
    paginationRef.value.totalRecords / paginationRef.value.pageSize,
  );
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
const handleActiveMultiple = async () => {
  await shiftStoreInstance.activeMultipleShifts(idsSelected.value);
};
/**
 * Xử lý khi hủy kích hoạt nhiều ca làm việc
 */
const handleInactiveMultiple = async () => {
  await shiftStoreInstance.inactiveMultipleShifts(idsSelected.value);
};
/**
 * Xử lý khi xóa nhiều ca làm việc
 */
const handleDeleteMultiple = async () => {
  await shiftStoreInstance.deleteMultipleShifts(idsSelected.value);
  if (shiftStoreInstance.rows.length === 0) {
    if (paginationRef.value.totalRecords) {
      paginationRef.value.totalRecords =
        paginationRef.value.totalRecords - idsSelected.value.size;
    }
    if (paginationRef.value.totalPages) {
      paginationRef.value.totalPages = paginationRef.value.totalPages - 1;
    }
    paginationRef.value.pageIndex = paginationRef.value.pageIndex - 1;
  }

  idsSelected.value.clear();
};
/**
 * Xử lý lấy lại dữ liệu
 */
const handleReloadData = () => {
  paginationRef.value.pageIndex = 0;
  paginationRef.value.pageSize = 10;
  filterDTORef.value = {
    searchKeyword: "",
    filterByShiftColumn: [],
  };
};
/**
 * Xử lý khi xóa điều kiện lọc
 * @param index
 */
const handleRemoveFilter = (index: number) => {
  filterDTORef.value.filterByShiftColumn.splice(index, 1);
};
/**
 * Xử lý khi xóa tất cả điều kiện lọc
 */
const handleRemoveAllFilter = () => {
  filterDTORef.value.filterByShiftColumn = [];
};
/**
 * Mở modal thêm ca làm việc
 */
const handleOpenModal = () => {
  shiftModalRef.value.isClose = false;
  shiftModalRef.value.modalTitle = "Thêm ca làm việc";
};
/**
 * Mở modal chỉnh sửa ca làm việc
 */
const handleOpenModalUpdate = (row: TableRow<Shift>) => {
  shiftModalRef.value.isClose = false;
  shiftModalRef.value.modalTitle = "Chỉnh sửa ca làm việc";
  shiftModalRef.value.row = row;
};
/**
 * Lưu form ca làm việc
 */
const saveShiftForm = async () => {
  if (!shiftFormRef.value?.validateShiftModal()) {
    return;
  }

  const data = shiftFormRef.value.getData();
  if (!data) {
    return;
  }

  let shift: Shift = {} as Shift;
  data.formInputFields.map((field: any) => {
    field.formItems.map((item: any) => {
      if (item.type === CONSTANTS.BASE_INPUT_TYPE.FLOAT_NUM) {
        (shift as any)[item.field as keyof Shift] = parseFloat(
          item.value !== null ? item.value.toString().replace(",", ".") : 0,
        );
        return;
      }
      (shift as any)[item.field as keyof Shift] = item.value;
    });
  });
  await shiftStoreInstance.createShift(shift);

  if (shiftStoreInstance.error) {
    return;
  }
  
  shiftFormRef.value.clearForm();
  shiftModalRef.value.isClose = true;
  if (paginationRef.value.totalRecords) {
    paginationRef.value.totalRecords = paginationRef.value.totalRecords + 1;
    if (paginationRef.value.totalPages) {
      paginationRef.value.totalPages = Math.ceil(
        paginationRef.value.totalRecords / paginationRef.value.pageSize,
      );
    }
  }
};
// =====================METHODS END========================

const formData = computed<FormData | null>(() => {
  return shiftFormRef.value ? shiftFormRef.value.getData() : null;
});
const isFormValidateError = computed<boolean>(() => {
  return shiftFormRef.value !== null
    ? !!(
        shiftFormRef.value.getData().errorModal.message &&
        shiftFormRef.value.getData().errorModal.message !== ""
      )
    : false;
});

// =====================WATCH START=====================
/**
 * Watch thay đổi mảng lọc cột
 */
watch(
  () => filterDTORef.value,
  (newFilterDTO) => {
    getAllShiftsWithFilter(paginationRef.value, newFilterDTO);
  },
  {
    deep: true,
  },
);
/**
 * Watch thay đổi phân trang
 */
watch(
  () => ({
    pageIndex: paginationRef.value.pageIndex,
    pageSize: paginationRef.value.pageSize,
  }),
  (newPagination) => {
    getAllShiftsWithFilter(newPagination, filterDTORef.value);
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
    pageIndex: paginationRef.value.pageIndex,
    pageSize: paginationRef.value.pageSize,
  });
});
</script>
<template>
  <div class="development-page">
    <!-- =================PAGE HEADER================= -->
    <BasePageHeader title="Ca làm việc">
      <template #actions>
        <BaseBtn icon="add-white" text="Thêm" @click="handleOpenModal" />
      </template>
    </BasePageHeader>

    <!-- =================TABLE SHIFT================= -->
    <ShiftTable
      :loading="shiftStoreInstance.loading"
      :ids-selected="idsSelected"
      :filterDTO="filterDTORef"
      :pagination="paginationRef"
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
      @remove-condition-filter="handleRemoveFilter"
      @remove-all-condition-filter="handleRemoveAllFilter"
      @handle-change-current-page="paginationRef.pageIndex = $event"
      @open-shift-modal="handleOpenModalUpdate"
    />
    <!-- =================MODAL SHIFT FORM================= -->
    <BaseModal
      :is-close="shiftModalRef.isClose"
      :modal-title="shiftModalRef.modalTitle"
      :is-drag="shiftModalRef.isDrag"
      :style="shiftModalRef.style"
      @close="shiftModalRef.isClose = true"
    >
      <template #buttonHeaderCluster>
        <BaseBtn
          icon="icon-close"
          :is-hide-border="true"
          type="outline-neutral"
          @click="
            shiftModalRef.isClose = true;
            shiftModalRef.row = null;
          "
        ></BaseBtn>
      </template>
      <template #content>
        <ShiftForm ref="shiftFormRef" :row="shiftModalRef.row" />
      </template>
      <template #footer>
        <!-- @click="saveShiftForm" -->
        <BaseBtn
          text="Lưu"
          tooltipText="Ctrl + S"
          type="solid-brand"
          @click="saveShiftForm"
        ></BaseBtn>
        <!-- @click="saveAndAddShiftForm" -->
        <BaseBtn
          text="Lưu và thêm"
          tooltipText="Ctrl + Shift + S"
          type="outline-neutral"
        ></BaseBtn>
        <BaseBtn
          text="Hủy"
          tooltipText="ESC"
          type="outline-neutral"
          @click="
            shiftModalRef.isClose = true;
            shiftModalRef.row = null;
          "
        ></BaseBtn>
      </template>
    </BaseModal>

    <!-- =================MODAL ERROR================= -->
    <BaseModal
      :is-close="!(isFormValidateError || shiftStoreInstance.error)"
      :modal-title="formData ? formData.errorModal.title || '' : ''"
      :is-drag="false"
      :is-hide-footer-line="true"
      :style="{
        width: '435px',
        touchAction: 'none',
        minHeight: '130px',
        maxHeight: '150px',
      }"
      :icon-title="formData ? formData.errorModal.iconTitle || '' : ''"
    >
      <template #buttonHeaderCluster>
        <BaseBtn
          icon="icon-close-20"
          icon-size="icon20"
          :is-hide-border="true"
          type="outline-neutral"
          @click="
            formData && (formData.errorModal.message = '');
            shiftStoreInstance.setError(null);
          "
        ></BaseBtn>
      </template>
      <template #messageError>
        <div
          class="msg-item"
          style="padding-left: 30px"
          v-html="
            (formData && formData.errorModal.message) ||
            shiftStoreInstance.error
          "
        ></div>
      </template>
      <template #footer>
        <BaseBtn
          text="Đóng"
          type="solid-brand"
          @click="
            formData && (formData.errorModal.message = '');
            shiftStoreInstance.setError(null);
          "
        ></BaseBtn>
      </template>
    </BaseModal>
  </div>
</template>
<style scoped></style>
