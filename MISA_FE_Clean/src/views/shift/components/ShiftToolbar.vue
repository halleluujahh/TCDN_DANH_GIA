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
}
const props = defineProps<ShiftToolbarProps>();
const emits = defineEmits<ShiftToolbarEmits>();

/**
 * Từ khóa tìm kiếm chung
 */
const searchKeywordRef = ref<string>("");

/**
 * Hàm debounce để tìm kiếm
 */
const debouncedSearch = debounce((value: string) => {
  emits("changeSearchKeyword", value);
}, 500);
/**
 * Xử lý lấy lại dữ liệu
 */
const handleReloadData = () => {
  searchKeywordRef.value = "";
  emits("reloadData");
};
/**
 * Kiểm tra có bất kỳ item nào được chọn không
 */
const isAnySelection = computed<boolean>(() => {
  return (props.idsSelected?.size || 0) > 0;
});
/**
 * Số lượng item đã chọn
 */
const selectedCount = computed<number>(() => {
  return props.idsSelected?.size || 0;
});
/**
 * Kiểm tra có bất kỳ item nào được chọn có trạng thái Active không
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
 * Watch từ khóa tìm kiếm và phát sự kiện lên cha
 */
watch(searchKeywordRef, (newVal) => {
  debouncedSearch(newVal);
});
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
          v-if="isAnyStatusActiveSelected"
          @click="emits('activeMultiple')"
          icon="active"
          text="Sử dụng"
          type="outline-success"
        />
        <!-- Unactive hàng loạt -->
        <BaseBtn
          v-if="isAnyStatusInactiveSelected"
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
      <div class="filter-conditions h-full">
        <!-- Lặp hiển thị các filter đã áp dụng -->
        <!-- 
         v-for="(itemHeader, indexHeader) in tableDataClone.header"
         -->
        <template>
          <!-- 
            v-if="
              itemHeader.filterTypeAfterSaved !== null &&
              itemHeader.filterTypeAfterSaved !== undefined &&
              itemHeader.valueFilterTypeAfterSaved !== null &&
              itemHeader.valueFilterTypeAfterSaved !== undefined
            "
             -->
          <div class="filter-item">
            <div class="lable-value-filter">
              <!-- Hiển thị ở đây -->
              <!-- {{ itemHeader.text }} -->
              <span></span>
              <!-- Đối với trạng thái hiển thị ở đây -->
              <!-- 
              {{
                  itemHeader.typeFilter === CONSTANTS.BASE_INPUT_TYPE.COMBOBOX
                    ? CONSTANTS.STATUS_SHIFT[
                        itemHeader.valueFilterTypeAfterSaved
                      ]
                    : itemHeader.typeFilter === CONSTANTS.BASE_INPUT_TYPE.DATE
                      ? CONSTANTS.DATE_FILTER_COLUMN_TYPE_TEXT[
                          itemHeader.filterTypeAfterSaved
                        ]
                      : CONSTANTS.FILTER_COLUMN_TYPE_TEXT[
                          itemHeader.filterTypeAfterSaved
                        ]
                }}
               -->
              <div style="color: #009b71"></div>
              <!-- Còn lại hiển thị ở đây -->
              <!-- 
               v-if="
                  itemHeader.typeFilter !== CONSTANTS.BASE_INPUT_TYPE.COMBOBOX
                "
               -->
              <!-- {{ itemHeader.valueFilterTypeAfterSaved }} -->
              <span></span>
            </div>
            <!-- Xóa filter ở đây -->
            <!-- @click="
                handleEmitActionBtn(
                  'removeConditionFilter',
                  null,
                  indexHeader,
                  null,
                  null,
                )
              " -->
            <div class="icon16 pointer icon-close"></div>
          </div>
        </template>
        <!-- Xóa tất cả filter ở đây -->
        <!-- v-if="isShowBtnRemoveAllConditionFilter" -->
        <!-- @click="
            handleEmitActionBtn(
              'removeAllConditionFilter',
              null,
              null,
              null,
              null,
            )
          " -->
        <!-- Bỏ lọc -->
        <div class="delete-all-filter"></div>
      </div>
    </div>
    <!-- Hiển thị khi  -->
    <!-- v-show="!isAnySelection" -->
    <div class="action flex-row">
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
</style>
