<script setup lang="ts">
// @ts-ignore
import BaseModal from "../../../components/BaseModal.vue";
// @ts-ignore
import BaseTable from "../../../components/BaseTable.vue";
import { useShiftTable } from "../../../composables/shift/use-shift-table";
import type { Shift } from "../../../types/models/shift/shift";
import type { ColumnFilterModal } from "../../../types/ui/column-filter-modal";
import type { TableColumn } from "../../../types/ui/table-column";
import type { TableRow } from "../../../types/ui/table-row";
// @ts-ignore
import { computed, defineProps, ref, defineEmits, onUpdated, watch } from "vue";
import { CONSTANTS } from "../../../constants/common";
// @ts-ignore
import BaseDropdown from "../../../components/BaseDropdown.vue";
// @ts-ignore
import BaseCombobox from "../../../components/BaseCombobox.vue";
import { getItemDisplayText } from "../../../composables/common/use-combobox";
// @ts-ignore
import BaseBtn from "../../../components/BaseBtn.vue";
import type { ColumnSort } from "../../../types/ui/column-sort";
import type { Pagination } from "../../../types/ui/pagination";
import { calculatePositionMenu } from "../../../composables/common/use-position";
// @ts-ignore
import BaseInput from "../../../components/BaseInput.vue";
import type { FilterDTO } from "../../../types/DTO/shift/filter-dto";
import { useAppStore } from "../../../stores/app-store";
// @ts-ignore
import BaseSelectbox from "../../../components/BaseSelectbox.vue";
import type { MoreMenuOption } from "../../../types/ui/more-menu";
// @ts-ignore
import ShiftToolbar from "./ShiftToolbar.vue";

const appStore = useAppStore();
// =====================TYPE DEFINITIONS START=====================
interface ShiftTableProps {
  idsSelected?: Set<string>;
  loading?: boolean;
  filterDTO?: FilterDTO;
  pagination: Pagination;
}
interface TableEmits<T> {
  (e: "toggle-check", row: TableRow<T>): void;
  (e: "toggle-check-all", row: TableRow<T>[]): void;
  (e: "double-click", row: TableRow<T>): void;
  (e: "filter-change", filterArrayRef: ColumnFilterModal[]): void;
  (
    e: "group-option-change",
    sortArrayRef: ColumnSort[],
    columns: TableColumn<T>[],
  ): void;
  (e: "changeSearchKeyword", searchKeyword: string): void;
  (e: "unSelectedAll"): void;
  (e: "activeMultiple"): void;
  (e: "inactiveMultiple"): void;
  (e: "deleteMultiple"): void;
  (e: "reloadData"): void;
  (e: "removeConditionFilter", index: number): void;
  (e: "removeAllConditionFilter"): void;
  (e: "handleChangeCurrentPage", pageIndex: number): void;
  (e: "openShiftModal", row: TableRow<Shift>): void;
  (e: "openShiftModalClonable", row: TableRow<Shift>): void;
  (e: "active", id: string[]): void;
  (e: "inactive", id: string[]): void;
  (e: "delete", id: string[]): void;
}
// =====================TYPE DEFINITIONS END=====================

// =====================REACTIVITY START========================
/**
 * Định nghĩa cột cho bảng ca làm việc
 * Created By hanv 02/02/2026
 */
const columns = ref<TableColumn<Shift>[]>(
  appStore.tableHeaders as TableColumn<Shift>[],
);
/**
 * Mảng lọc dữ liệu cho cột
 * Created By hanv 02/02/2026
 */
const filterArrayRef = ref<ColumnFilterModal[]>([]);
/**
 * Mảng sắp xếp cột
 * Created By hanv 02/02/2026
 */
const sortArrayRef = ref<ColumnSort[]>([]);
/**
 * Trạng thái mở menu thao tác thêm
 * Created By hanv 03/02/2026
 */
const openMoreMenuRef = ref<MoreMenuOption>({ isOpen: false, style: {} });
// =====================REACTIVITY END========================

// =====================COMPOSABLES START=======================
/**
 * Lấy dữ liệu bảng ca làm việc
 * Created By hanv 02/02/2026
 */
const {
  comboBoxShiftStatus,
  selectBoxGroupOptions,
  moreMenuOptions,
  mapSortArrayPinToTablePinFunc,
  columnSortedByPositionFunc,
  rowSortedByColumnPositionFunc,
} = useShiftTable();
// =====================COMPOSABLES END=======================

// ==================PROPS & EMITS START======================
// @ts-ignore
const props = defineProps<ShiftTableProps>();
const emits = defineEmits<TableEmits<Shift>>();
// ==================PROPS & EMITS END======================

// =====================METHODS START========================
/**
 * Mở modal lọc dữ liệu cho cột
 * @param {Event} event - Sự kiện
 * @param {TableColumn<Shift>} column - Cột bảng
 * Created By hanv 02/02/2026
 */
const handleOpenModalFilterColumn = (
  event: Event,
  column: TableColumn<Shift>,
) => {
  closeSortColumn();

  if (filterArrayRef.value.length > 0) {
    let isExist = false;
    filterArrayRef.value.forEach((item: ColumnFilterModal) => {
      if (item.columnKey === column.key) {
        item.isClose = !item.isClose;
        item.style = calculatePositionMenu(event) as Record<string, string>;

        isExist = true;
        return;
      }
    });
    if (isExist) return;
  }

  closeDropdownFilterColumn();

  filterArrayRef.value.push({
    event: event,
    isClose: false,
    columnKey: column.key,
    columnType: column.type,
    filterType: column.filterType as "text" | "number",
    filterOption: column.filterOptions ?? [],
    style: {
      ...(calculatePositionMenu(event) as Record<string, string>),
      width: "fit-content !important",
    },
    valueSearch: "" as string | number,
    filterTypeSearch:
      column.filterType === CONSTANTS.BASE_INPUT_TYPE.TEXT ? 1 : (0 as number),
  });
};
/**
 * Đóng modal lọc dữ liệu cho cột
 * Created By hanv 02/02/2026
 */
const closeDropdownFilterColumn = () => {
  filterArrayRef.value.map((item: ColumnFilterModal) => {
    if (item.isClose === false) {
      item.isClose = true;
    }
  });
};
/**
 * Bỏ lọc dữ liệu cho cột
 * Created By hanv 02/02/2026
 */
const removeDropdownFilterColumn = () => {
  filterArrayRef.value.map((item: ColumnFilterModal, idx: number) => {
    if (item.isClose === false) {
      filterArrayRef.value.splice(idx, 1);
      return;
    }
  });
  emits("filter-change", filterArrayRef.value);
};
/**
 * Mở modal nhóm tùy chọn cho cột
 * @param {Event} event - Sự kiện
 * @param {TableColumn<Shift>} column - Cột bảng
 * Created By hanv 02/02/2026
 */
const handleOpenComboboxGroupOptionColumn = (
  event: Event,
  column: TableColumn<Shift>,
) => {
  closeDropdownFilterColumn();

  if (sortArrayRef.value.length > 0) {
    let isExist = false;
    sortArrayRef.value.forEach((item: ColumnSort) => {
      if (item.columnKey === column.key) {
        item.isOpen = !item.isOpen;
        item.style = calculatePositionMenu(event) as Record<string, string>;

        isExist = true;
        return;
      }
    });
    if (isExist) return;
  }

  closeSortColumn();
  sortArrayRef.value.push({
    columnKey: column.key,
    order: CONSTANTS.SORT_TYPE.Default,
    isPin: false,
    isOpen: true,
    style: calculatePositionMenu(event) as Record<string, string>,
  });
};
/**
 * Đóng select box sắp xếp cho cột
 * Created By hanv 02/02/2026
 */
const closeSortColumn = () => {
  sortArrayRef.value.map((item: ColumnSort) => {
    if (item.isOpen === true) {
      item.isOpen = false;
    }
  });
};
/**
 * Hàm lọc dữ liệu theo cột
 * Created By hanv 02/02/2026
 */
const handleFilterByColumn = () => {
  emits("filter-change", filterArrayRef.value);
  closeDropdownFilterColumn();
};
/**
 * Xóa điều kiện lọc tại vị trí index
 * @param {number} index - Chỉ số điều kiện lọc
 * Created By hanv 02/02/2026
 */
const handleRemoveConditionFilter = (index: number) => {
  filterArrayRef.value.splice(index, 1);
  emits("removeConditionFilter", index);
};
/**
 * Xóa tất cả điều kiện lọc
 * Created By hanv 02/02/2026
 */
const handleRemoveAllFilter = () => {
  filterArrayRef.value = [];
  emits("removeAllConditionFilter");
};
/**
 * Mở menu thao tác thêm
 * @param event
 * @param row
 * Created By hanv 03/02/2026
 */
const toggleMoreMenu = (event: Event, row: TableRow<Shift>) => {
  // Xử lý mở menu
  moreMenuOptions.forEach((item, index) => {
    if (index === 1)
      item.text =
        row.data.shiftStatus === CONSTANTS.STATUS_SHIFT.Active
          ? CONSTANTS.STATUS_SHIFT[0]
          : CONSTANTS.STATUS_SHIFT[1];
    item.value = row;
    openMoreMenuRef.value.isOpen = !openMoreMenuRef.value.isOpen;
    openMoreMenuRef.value.style = calculatePositionMenu(
      event as Event,
    ) as Record<string, string>;
  });
};
// =====================METHODS END========================

// =====================COMPUTED START=====================
/**
 * Lấy modal lọc dữ liệu cho cột hiện tại
 * Created By hanv 02/02/2026
 */
const filterRef = computed<ColumnFilterModal>(
  () =>
    filterArrayRef.value.find((item: ColumnFilterModal) => !item.isClose) ?? {
      isClose: true,
      event: null,
      columnKey: "",
      columnType: "",
      filterType: "text",
      filterOption: [],
      style: {},
      valueSearch: "",
      filterTypeSearch: 1,
    },
);

/**
 * Lấy thông tin sắp xếp cột hiện tại
 * Created By hanv 02/02/2026
 */
const sortRef = computed<ColumnSort>(
  () =>
    sortArrayRef.value.find((item: ColumnSort) => item.isOpen) ?? {
      columnKey: "",
      order: CONSTANTS.SORT_TYPE.Default,
      isPin: false,
      isOpen: false,
      style: {},
    },
);
/**
 * Các cột trong bảng được sắp xếp theo vị trí
 * @return {TableColumn<Shift>[]} - Danh sách cột được sắp xếp
 * Created By hanv 02/02/2026
 */
const columnSortedByPosition = computed<TableColumn<Shift>[]>(() => {
  return columnSortedByPositionFunc(columns.value);
});
/**
 * Các hàng trong bảng được sắp xếp theo vị trí cột
 * @return {TableRow<Shift>[]} - Danh sách hàng được sắp xếp
 * Created By hanv 02/02/2026
 */
const rowDataItemsSortedByPosition = computed<TableRow<Shift>[]>(() => {
  return rowSortedByColumnPositionFunc(columnSortedByPosition.value);
});
// =====================COMPUTED END=====================

// =====================WATCH START=====================
/**
 * Watch thay đổi mảng sắp xếp cột
 * Created By hanv 02/02/2026
 */
watch(
  () =>
    sortArrayRef.value.map((item: ColumnSort) => ({
      order: item.order,
      isOpen: item.isOpen,
    })),
  (newSortArr, oldSortArr) => {
    if (sortArrayRef.value.some((item) => item.isOpen)) return;
    // Kiểm tra có thay đổi gì không
    const changed = newSortArr.some((item, index) => {
      if (oldSortArr[index] && item.order !== oldSortArr[index].order) {
        return true;
      }
      if (newSortArr.length !== oldSortArr.length) {
        return true;
      }
      return false;
    });
    if (!changed) return;

    // Emit cập nhật lại DTO lọc và sortOrder trong bảng
    emits("group-option-change", sortArrayRef.value, columns.value);
  },
);
/**
 * Watch thay đổi mảng ghim cột
 * Created By hanv 02/02/2026
 */
watch(
  () =>
    sortArrayRef.value.map((item: ColumnSort) => ({
      isPin: item.isPin,
    })),
  (newSortArr, oldSortArr) => {
    // Kiểm tra có thay đổi gì không
    const changed = newSortArr.some((item, index) => {
      if (oldSortArr[index] && item.isPin !== oldSortArr[index].isPin) {
        return true;
      }
      return false;
    });
    if (!changed) return;

    // Cập nhật lại vị trí ghim cột trong bảng
    mapSortArrayPinToTablePinFunc(sortArrayRef.value, columns.value);
  },
);
// =====================WATCH END=====================
</script>
<template>
  <div class="body-layout-list">
    <!-- ========================TABLE START======================== -->
    <BaseTable
      :columns="columnSortedByPosition"
      :rows="rowDataItemsSortedByPosition"
      :loading="props.loading"
      :ids-selected="props.idsSelected"
      :pagination="props.pagination"
      :filter-array-ref="filterArrayRef"
      @toggle-check="emits('toggle-check', $event)"
      @toggle-check-all="emits('toggle-check-all', $event)"
      @filter-change="handleOpenModalFilterColumn"
      @group-option-change="handleOpenComboboxGroupOptionColumn"
      @handle-change-current-page="emits('handleChangeCurrentPage', $event)"
    >
      <template #toolbar-grid>
        <ShiftToolbar
          :ids-selected="props.idsSelected"
          :filterDTO="props.filterDTO"
          :rows="rowDataItemsSortedByPosition"
          :columns="columnSortedByPosition"
          @change-search-keyword="emits('changeSearchKeyword', $event)"
          @un-selected-all="emits('unSelectedAll')"
          @active-multiple="emits('activeMultiple')"
          @inactive-multiple="emits('inactiveMultiple')"
          @delete-multiple="emits('deleteMultiple')"
          @reload-data="emits('reloadData')"
          @remove-condition-filter="handleRemoveConditionFilter"
          @remove-all-condition-filter="handleRemoveAllFilter"
        />
      </template>
      <template #row-actions="{ row }">
        <BaseBtn
          icon="pencil"
          tooltipText="Sửa"
          :isHideBorder="true"
          :isBtnActionTable="true"
          @click="emits('openShiftModal', row)"
        />
        <BaseBtn
          icon="feature-more-blue"
          :isHideBorder="true"
          :isBtnActionTable="true"
          @click="toggleMoreMenu($event, row)"
        />
      </template>
    </BaseTable>
    <!-- ========================TABLE END======================== -->

    <!-- ====================SORT COLUMN START==================== -->
    <BaseSelectbox
      :is-open="sortRef.isOpen"
      @close="closeSortColumn"
      :select-box-items="selectBoxGroupOptions"
      @select="
        (item: any) => {
          if (item.value === `pin` || item.value === `unpin`) {
            sortRef.isPin = item.value === `pin` ? true : false;
            return;
          }
          sortRef.order = Number(item.value);
        }
      "
      :style="sortRef.style"
    />
    <!-- ====================SORT COLUMN END==================== -->

    <!-- ====================MORE MENU START==================== -->
    <BaseSelectbox
      :is-open="openMoreMenuRef.isOpen"
      @close="openMoreMenuRef.isOpen = false"
      @select="
        (item: any) => {
          switch (item.icon) {
            case 'duplicate':
              // Xử lý nhân bản
              emits('openShiftModalClonable', item.value as TableRow<Shift>);
              break;
            case 'empty':
              if (item.text === CONSTANTS.STATUS_SHIFT[1]) {
                // Xử lý chuyển sang trạng thái active
                emits('active', [item.value.data.shiftId]);
              } else {
                // Xử lý chuyển sang trạng thái inactive
                emits('inactive', [item.value.data.shiftId]);
              }
              break;
            case 'trash':
              // Xử lý xóa
              emits('delete', [item.value.data.shiftId]);
              break;
          }
        }
      "
      :select-box-items="moreMenuOptions"
      :style="openMoreMenuRef.style"
    />
    <!-- ====================MORE MENU END==================== -->

    <!-- ====================DROPDOWN FILTER COLUMN START==================== -->
    <BaseDropdown
      :is-close="filterRef.isClose"
      :style="filterRef.style"
      :dropdown-title="`Lọc dữ liệu cột ${filterRef.columnKey}`"
      @close="closeDropdownFilterColumn"
    >
      <template #dropdown-body>
        <div class="column-filter flex">
          <div class="filter-operator w-100">
            <BaseCombobox
              :comboboxItems="filterRef.filterOption"
              :typeFilter="filterRef.filterType"
              :textDisplay="
                String(
                  getItemDisplayText(
                    filterRef.filterType,
                    filterRef.filterTypeSearch,
                  ),
                )
              "
              v-model="filterRef.filterTypeSearch"
            />
          </div>
        </div>
        <div class="filter-value">
          <div
            :class="[
              'ms-editor',
              'w-100',
              'flex',
              'items-center',
              'gap-4',
              'ms-validate',
              'mb-16px',
            ]"
            v-if="filterRef.columnType !== 'boolean'"
          >
            <BaseInput
              fieldName="Giá trị lọc"
              autoComplete="on"
              placeholder="Nhập giá trị lọc"
              :required="false"
              v-model="filterRef.valueSearch"
            />
          </div>
          <BaseCombobox
            v-else
            :comboboxItems="comboBoxShiftStatus"
            :typeFilter="filterRef.columnType"
            :tooltipText="
              getItemDisplayText(filterRef.columnType, filterRef.valueSearch)
            "
            :textDisplay="
              String(
                getItemDisplayText(filterRef.columnType, filterRef.valueSearch),
              )
            "
            v-model="filterRef.valueSearch"
          />
        </div>
      </template>
      <template #dropdown-footer>
        <div class="ml-auto flex gap-x-2">
          <BaseBtn
            text="Hủy"
            type="outline-neutral"
            @click="closeDropdownFilterColumn"
          />
          <BaseBtn
            text="Áp dụng"
            type="solid-brand"
            @click="handleFilterByColumn"
          />
        </div>

        <div>
          <BaseBtn
            text="Bỏ lọc"
            type="filled-neutral"
            @click="removeDropdownFilterColumn"
          />
        </div>
      </template>
    </BaseDropdown>
    <!-- ====================DROPDOWN FILTER COLUMN END==================== -->
  </div>
</template>
<style scoped>
.body-layout-list {
  flex: 1;
  height: 0;
}
</style>
