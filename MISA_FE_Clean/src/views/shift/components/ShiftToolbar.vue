<script setup lang="ts">
// @ts-ignore
import { defineProps, ref, defineEmits, watch, computed } from "vue";
// @ts-ignore
import BaseInput from "../../../components/BaseInput.vue";
// @ts-ignore
import BaseBtn from "../../../components/BaseBtn.vue";
import type { TableRow } from "../../../types/ui/table-row";
import type { Shift } from "../../../types/models/shift/shift";
import type { TableColumn } from "../../../types/ui/table-column";
import { CONSTANTS } from "../../../constants/common";
import type { FilterDTO } from "../../../types/DTO/shift/filter-dto";
import { debounce } from "lodash";

interface ShiftToolbarProps {
  idsSelected?: Set<string>;
  rows: TableRow<Shift>[];
  columns: TableColumn<Shift>[];
  filterDTO?: FilterDTO;
}
interface ShiftToolbarEmits {
  (e: "changeSearchKeyword", searchKeyword: string): void;
  (e: "unSelectedAll"): void;
  (e: "activeMultiple"): void;
  (e: "inactiveMultiple"): void;
  (e: "deleteMultiple"): void;
  (e: "reloadData"): void;
  (e: "removeConditionFilter", index: number): void;
  (e: "removeAllConditionFilter"): void;
}
const props = defineProps<ShiftToolbarProps>();
const emits = defineEmits<ShiftToolbarEmits>();

/**
 * Từ khóa tìm kiếm chung
 * Created By hanv 02/02/2026
 */
const searchKeywordRef = ref<string>("");

// =====================METHODS START========================
/**
 * Hàm debounce để tìm kiếm
 * @param {string} value - Giá trị tìm kiếm
 * Created By hanv 02/02/2026
 */
const debouncedSearch = debounce((value: string) => {
  emits("changeSearchKeyword", value);
}, 500);
/**
 * Xử lý lấy lại dữ liệu
 * Created By hanv 02/02/2026
 */
const handleReloadData = () => {
  searchKeywordRef.value = "";
  emits("reloadData");
};
/**
 * Lấy tên cột filter để hiển thị
 * @param {string} filterName - Tên cột filter
 * @return {string} - Tên cột hiển thị
 * Created By hanv 02/02/2026
 */
const getFilterColumnName = (filterName: string): string => {
  return CONSTANTS.COLUMN_NAME_SHIFT_DISPLAY[
    filterName as keyof typeof CONSTANTS.COLUMN_NAME_SHIFT_DISPLAY
  ];
};
/**
 * Lấy tên loại filter
 * @param {any} filter - Bộ lọc
 * @return {string} - Tên loại filter
 * Created By hanv 02/02/2026
 */
const getFilterType = (filter: any): string => {
  if (filter.filterColumnType !== undefined) {
    return CONSTANTS.FILTER_COLUMN_TYPE_TEXT[
      filter.filterColumnType as keyof typeof CONSTANTS.FILTER_COLUMN_TYPE_TEXT
    ];
  } else {
    return CONSTANTS.DATE_FILTER_COLUMN_TYPE_TEXT[
      filter.dateFilterColumnType as keyof typeof CONSTANTS.DATE_FILTER_COLUMN_TYPE_TEXT
    ];
  }
};
// =====================METHODS END========================

// =====================COMPUTED START=====================
/**
 * Kiểm tra có bất kỳ item nào được chọn không
 * @return {boolean} - True nếu có item được chọn
 * Created By hanv 02/02/2026
 */
const isAnySelection = computed<boolean>(() => {
  return (props.idsSelected?.size || 0) > 0;
});
/**
 * Số lượng item đã chọn
 * @return {number} - Số lượng item đã chọn
 * Created By hanv 02/02/2026
 */
const selectedCount = computed<number>(() => {
  return props.idsSelected?.size || 0;
});
/**
 * Kiểm tra có bất kỳ item nào được chọn có trạng thái Active không
 * @return {boolean} - True nếu có item Active được chọn
 * Created By hanv 02/02/2026
 */
const isAnyStatusActiveSelected = computed<boolean>(() => {
  if (!props.idsSelected) return false;
  return props.rows.some((row: TableRow<Shift>) => {
    if (props.idsSelected!.has(row.key as string)) {
      return props.columns.some((col: TableColumn<Shift>) => {
        if (row.data[col.key] === CONSTANTS.STATUS_SHIFT.Active) {
          return true;
        }
      });
    }
    return false;
  });
});
/**
 * Kiểm tra có bất kỳ item nào được chọn có trạng thái Inactive không
 * @return {boolean} - True nếu có item Inactive được chọn
 * Created By hanv 02/02/2026
 */
const isAnyStatusInactiveSelected = computed<boolean>(() => {
  return props.rows.some((row: TableRow<Shift>) => {
    if (props.idsSelected && props.idsSelected.has(row.key as string)) {
      return props.columns.some((col: TableColumn<Shift>) => {
        if (row.data[col.key] === CONSTANTS.STATUS_SHIFT.Inactive) {
          return true;
        }
      });
    }
    return false;
  });
});
/**
 * Kiểm tra có bất kỳ filter nào được áp dụng không
 * @return {boolean} - True nếu có filter được áp dụng
 * Created By hanv 02/02/2026
 */
const isAnyFilter = computed<boolean>(() => {
  if (!props.filterDTO?.filterByShiftColumn) return false;
  return props.filterDTO?.filterByShiftColumn.some(
    (filter: any) =>
      filter.isSaved && filter.value !== null && filter.value !== "",
  );
});
// =====================COMPUTED END=====================

// =====================WATCH START=====================
/**
 * Watch từ khóa tìm kiếm và phát sự kiện lên cha
 * @param {string} newVal - Giá trị mới của từ khóa tìm kiếm
 * Created By hanv 02/02/2026
 */
watch(searchKeywordRef, (newVal) => {
  debouncedSearch(newVal);
});
// =====================WATCH END=====================
</script>

<template>
  <div class="condition-box flex-row">
    <div class="flex control-gap items-center">
      <div
        class="ms-input ms-editor w-100 flex items-center gap-4 search-input-list"
      >
        <!-- Gán sự kiện tìm kiếm -->
        <BaseInput
          autoComplete="on"
          placeholder="Tìm kiếm"
          icon="search"
          iconPosition="left"
          iconSize="icon16"
          :required="false"
          v-model="searchKeywordRef"
        />
      </div>
      <!-- Chỉ hiển thị khi có item được chọn -->
      <div v-show="isAnySelection" class="feature-batch flex">
        <div class="selected-count">
          Đã chọn
          <!-- Hiển thị số item đẫ chọn trong bảng -->
          <span class="bold">{{ selectedCount }}</span>
        </div>
        <!-- Bỏ chọn -->
        <div class="unselected" @click="emits('unSelectedAll')">Bỏ chọn</div>
        <!-- Active hàng loạt -->
        <BaseBtn
          v-if="isAnyStatusInactiveSelected"
          @click="emits('activeMultiple')"
          icon="active"
          text="Sử dụng"
          type="outline-success"
        />
        <!-- Unactive hàng loạt -->
        <BaseBtn
          v-if="isAnyStatusActiveSelected"
          @click="emits('inactiveMultiple')"
          icon="inactive"
          text="Ngừng sử dụng"
          type="outline-danger"
        />
        <!-- Xóa hàng loạt -->
        <BaseBtn
          @click="emits('deleteMultiple')"
          icon="trash"
          text="Xóa"
          type="outline-danger"
        />
      </div>
      <div
        v-if="filterDTO && filterDTO.filterByShiftColumn.length > 0"
        class="filter-conditions h-full"
      >
        <!-- Lặp hiển thị các filter đã áp dụng -->
        <template v-for="(filter, index) in filterDTO.filterByShiftColumn">
          <div v-if="filter.isSaved" :key="index" class="filter-item">
            <div class="lable-value-filter">
              <span>
                {{ getFilterColumnName(filter.name) }}
              </span>
              <!-- Đối với kiểu lọc hiển thị ở đây -->
              <div style="color: #009b71">
                {{ getFilterType(filter) }}
              </div>
              <!-- Giá trị lọc hiển thị ở đây -->
              <span>{{ filter.value }}</span>
            </div>
            <!-- Xóa filter ở đây -->
            <div
              @click="emits('removeConditionFilter', index)"
              class="icon16 pointer icon-close"
            ></div>
          </div>
        </template>
        <!-- Xóa tất cả filter ở đây -->
        <div
          v-if="isAnyFilter"
          @click="emits('removeAllConditionFilter')"
          class="delete-all-filter"
        >
          Bỏ lọc
        </div>
      </div>
    </div>
    <!-- Hiển thị khi  -->
    <div v-show="!isAnySelection" class="action flex-row">
      <!-- Nút lấy lại dữ liệu -->
      <BaseBtn
        icon="reload"
        text=""
        type="outline-neutral"
        tooltipText="Lấy lại dữ liệu"
        @click="handleReloadData"
      />
    </div>
  </div>
</template>

<style scoped>
.condition-box {
  padding: 8px 16px;
  background: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.condition-box .search-input-list {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 200px;
  height: auto;
}
.icon16.search {
  mask-image: url("/src/assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: 0px 0px;
}
.icon.left {
  margin: 0 4px 0 0;
}
.feature-batch {
  background-color: #fff;
  align-items: center;
  display: flex;
  gap: 8px;
  margin-left: 8px;
  height: 28px;
}
.feature-batch .unselected {
  color: #009b71;
  cursor: pointer;
  margin: 0 8px;
}
.form-list .action {
  z-index: 1;
  column-gap: 8px;
  margin: auto 0 auto auto;
}
.condition-container {
  position: absolute;
  border: none;
  z-index: 1002;
  background: white;
  min-width: 350px;
  width: -moz-fit-content;
  width: fit-content;
  font-weight: 400;
  font-size: 13px;
  border-radius: 4px;
  box-shadow:
    0 0 8px #0000001a,
    0 8px 16px #0000001a;
}
.condition-container .column-filter-text {
  font-weight: 600;
  font-size: 16px;
  margin-right: 30px;
}
.condition-container .close-condition-btn {
  position: absolute;
  right: 0;
}
.condition-container .filter-container .view-fitler-text {
  text-align: left;
}
.control-gap-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.condition-container .filter-operator {
  width: 100%;
}
.condition-container .buttons {
  flex-direction: row-reverse;
}
.filter-value .ms-input div {
  width: 100%;
}
.filter-conditions {
  display: flex;
  align-items: center;
  row-gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  margin-right: 8px;
  max-height: 56px;
  overflow-y: auto;
}
.filter-conditions {
  margin-bottom: 0;
}
.filter-item {
  max-width: calc(100% - 8px);
}
.filter-conditions .filter-item {
  display: flex;
  gap: 8px;
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  position: relative;
  margin-right: 8px;
  white-space: normal;
  align-items: center;
  background-color: #f3f4f6;
}
.filter-conditions .lable-value-filter {
  display: flex;
  gap: 8px;
}
.filter-conditions .delete-all-filter {
  display: inline-block;
  color: #f06666;
  cursor: pointer;
  white-space: nowrap;
}
.icon-close {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -96px 0px;
  background-color: #4b5563 !important;
}
</style>
