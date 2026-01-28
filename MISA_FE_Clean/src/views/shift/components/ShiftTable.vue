<script setup lang="ts">
import BaseModal from "../../../components/BaseModal.vue";
import BaseTable from "../../../components/BaseTable.vue";
import { useShiftTable } from "../../../composables/shift/use-shift-table";
import type { Shift } from "../../../types/models/shift/shift";
import type { ColumnFilterModal } from "../../../types/ui/column-filter-modal";
import type { TableColumn } from "../../../types/ui/table-column";
import type { TableRow } from "../../../types/ui/table-row";
import { computed, defineProps, ref, defineEmits, onUpdated, watch } from "vue";
import { CONSTANTS } from "../../../constants/common";
import BaseDropdown from "../../../components/BaseDropdown.vue";
import BaseCombobox from "../../../components/BaseCombobox.vue";
import { getItemDisplayText } from "../../../composables/common/use-combobox";
import BaseBtn from "../../../components/BaseBtn.vue";
import type { ColumnSort } from "../../../types/ui/column-sort";
import type { Pagination } from "../../../types/ui/pagination";
import { calculatePositionMenu } from "../../../composables/common/use-position";
import BaseInput from "../../../components/BaseInput.vue";
import BaseSelectbox from "../../../components/BaseSelectbox.vue";
import type { FilterDTO } from "../../../types/DTO/shift/filter-dto";

// =====================TYPE DEFINITIONS START=====================
interface ShiftTableProps {
  loading?: boolean;
}
interface TableEmits<T> {
  (e: "toggle-check", row: TableRow<T>): void;
  (e: "toggle-check-all", row: TableRow<T>[]): void;
  (e: "double-click", row: TableRow<T>): void;
  (e: "filter-change", pagination: Pagination, filterDTO: FilterDTO): void;
}
// =====================TYPE DEFINITIONS END=====================

// =====================REACTIVITY START========================
/**
 * Định nghĩa cột cho bảng ca làm việc
 */
const table = ref<TableColumn<Shift>[]>([
  {
    key: "shiftId",
    title: "Id ca",
    type: "text",
    sortable: true,
    hiding: true,

    realPos: 0,
  },
  {
    key: "shiftCode",
    title: "Mã ca",
    type: "text",
    width: "120px",
    sortable: true,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "left",

    realPos: 1,
  },
  {
    key: "shiftName",
    title: "Tên ca",
    type: "text",
    width: "250px",
    sortable: true,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "left",

    realPos: 2,
  },
  {
    key: "shiftBeginTime",
    title: "Giờ vào ca",
    type: "time",
    width: "150px",
    sortable: true,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "left",
    render: (rowData: string | number) => {
      return rowData ? rowData.toString().slice(0, 5) : "--";
    },

    realPos: 3,
  },
  {
    key: "shiftEndTime",
    title: "Giờ hết ca",
    type: "time",
    width: "150px",
    sortable: true,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "left",
    render: (rowData: string | number) => {
      return rowData ? rowData.toString().slice(0, 5) : "--";
    },

    realPos: 4,
  },
  {
    key: "shiftBeginBreakTime",
    title: "Bắt đầu nghỉ giữa ca",
    type: "time",
    width: "220px",
    sortable: true,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "left",
    render: (rowData: string | number) => {
      return rowData ? rowData.toString().slice(0, 5) : "--";
    },

    realPos: 5,
  },
  {
    key: "shiftEndBreakTime",
    title: "Kết thúc",
    type: "time",
    width: "220px",
    sortable: true,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "left",
    render: (rowData: string | number) => {
      return rowData ? rowData.toString().slice(0, 5) : "--";
    },

    realPos: 6,
  },
  {
    key: "shiftWorkingTime",
    title: "Thời gian làm việc (giờ)",
    type: "number",
    width: "250px",
    sortable: true,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "right",
    render: (rowData: string | number) => {
      return rowData ? Number(rowData).toFixed(2).toString() : "0,00";
    },

    realPos: 7,
  },
  {
    key: "shiftBreakingTime",
    title: "Thời gian nghỉ giữa ca (giờ)",
    type: "number",
    width: "250px",
    sortable: true,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "right",
    render: (rowData: string | number) => {
      return rowData ? Number(rowData).toFixed(2).toString() : "0,00";
    },

    realPos: 8,
  },
  {
    key: "shiftStatus",
    title: "Trạng thái",
    type: "boolean",
    width: "200px",
    sortable: false,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "left",
    render: (rowData: string | number) => {
      return rowData === 1 ? "Đang sử dụng" : "Ngừng sử dụng";
    },

    realPos: 9,
  },
  {
    key: "createdBy",
    title: "Người tạo",
    type: "text",
    width: "160px",
    sortable: true,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "left",

    realPos: 10,
  },
  {
    key: "createdDate",
    title: "Ngày tạo",
    type: "date",
    width: "160px",
    sortable: true,

    filterable: true,
    filterType: "date",
    filterOptions: CONSTANTS.FilterOptionsType.Date,

    textAlign: "left",
    render: (rowData: string | number) => {
      const date = new Date(rowData as string);
      return date
        ? date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "--";
    },

    realPos: 11,
  },
  {
    key: "modifiedBy",
    title: "Người sửa",
    type: "text",
    width: "160px",
    sortable: true,

    filterable: true,
    filterType: "text",
    filterOptions: CONSTANTS.FilterOptionsType.Text,

    textAlign: "left",
    render: (rowData: string | number) => {
      return rowData ? rowData.toString() : "--";
    },

    realPos: 12,
  },
  {
    key: "modifiedDate",
    title: "Ngày sửa",
    type: "date",
    width: "160px",
    sortable: true,

    filterable: true,
    filterType: "date",
    filterOptions: CONSTANTS.FilterOptionsType.Date,

    textAlign: "left",
    render: (rowData: string | number) => {
      const date = new Date(rowData as string);
      return date
        ? date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "--";
    },

    realPos: 13,
  },
]);
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

const filterDTORef = ref<FilterDTO>({
  searchKeyword: "",
  filterByShiftColumn: [],
});

/**
 * Mảng lọc dữ liệu cho cột
 */
const filterArrayRef = ref<ColumnFilterModal[]>([]);

/**
 * Mảng sắp xếp cột
 */
const sortArrayRef = ref<ColumnSort[]>([]);
/**
 * Từ khóa tìm kiếm chung
 */
const searchKeywordRef = ref<string>("");
// =====================REACTIVITY END========================

// =====================COMPOSABLES START=======================
/**
 * Lấy dữ liệu bảng ca làm việc
 */
const {
  mapShiftToTableRows,
  comboBoxShiftStatus,
  selectBoxGroupOptions,
  mapSortArrayToFilterDTOFunc,
  mapSortArrayPinToTablePinFunc,
  columnSortedByPositionFunc,
  rowSortedByColumnPositionFunc,
  mapFilterArrayToFilterDTOFunc,
} = useShiftTable();
// =====================COMPOSABLES END=======================

// ==================PROPS & EMITS START======================
// @ts-ignore
const props = defineProps<ShiftTableProps>();
const emits = defineEmits<TableEmits<Shift>>();
// ==================PROPS & EMITS END======================

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
 * Mở modal lọc dữ liệu cho cột
 * @param event
 * @param column
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
 */
const removeDropdownFilterColumn = () => {
  filterArrayRef.value.map((item: ColumnFilterModal, idx: number) => {
    if (item.isClose === false) {
      filterArrayRef.value.splice(idx, 1);
      return;
    }
  });
  if (filterArrayRef.value.length === 0) {
    filterDTORef.value.filterByShiftColumn = [];
  } else {
    mapFilterArrayToFilterDTOFunc(filterArrayRef.value, filterDTORef.value);
  }
};

/**
 * Mở modal nhóm tùy chọn cho cột
 * @param event
 * @param column
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
 */
const handleFilterByColumn = () => {
  mapFilterArrayToFilterDTOFunc(filterArrayRef.value, filterDTORef.value);
  closeDropdownFilterColumn();
};
// =====================METHODS END========================

// =====================COMPUTED START=====================
/**
 * Lấy modal lọc dữ liệu cho cột hiện tại
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
 */
const columnSortedByPosition = computed<TableColumn<Shift>[]>(() => {
  return columnSortedByPositionFunc(table.value);
});
/**
 * Các hàng trong bảng được sắp xếp theo vị trí cột
 */
const rowDataItemsSortedByPosition = computed<TableRow<Shift>[]>(() => {
  return rowSortedByColumnPositionFunc(columnSortedByPosition.value);
});
// =====================COMPUTED END=====================

// =====================WATCH START=====================
/**
 * Watch thay đổi mảng sắp xếp cột
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

    // Cập nhật lại DTO lọc và sortOrder trong bảng
    mapSortArrayToFilterDTOFunc(
      sortArrayRef.value,
      filterDTORef.value,
      table.value,
    );
  },
);
/**
 * Watch thay đổi mảng ghim cột
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
    mapSortArrayPinToTablePinFunc(sortArrayRef.value, table.value);
  },
);
/**
 * Watch thay đổi mảng lọc cột
 */
watch(
  () => filterDTORef.value,
  (newFilterDTO) => {
    console.log("Emit filter-change from ShiftTable.vue");
    emits("filter-change", pagination.value, newFilterDTO);
  },
  {
    deep: true,
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
      :ids-selected="idsSelected"
      @toggle-check="handleToggleCheck"
      @toggle-check-all="handleToggleCheckAll"
      @filter-change="handleOpenModalFilterColumn"
      @group-option-change="handleOpenComboboxGroupOptionColumn"
    />
    <!-- ========================TABLE END======================== -->

    <!-- ====================SORT COLUMN START==================== -->
    <BaseSelectbox
      :is-open="sortRef.isOpen"
      @close="closeSortColumn"
      :select-box-items="selectBoxGroupOptions"
      textDisplay="Sắp xếp cột"
      @select="
        (value: string | number) => {
          if (value === `pin` || value === `unpin`) {
            sortRef.isPin = value === `pin` ? true : false;
            return;
          }
          sortRef.order = Number(value);
        }
      "
      :style="sortRef.style"
    />
    <!-- ====================SORT COLUMN END==================== -->

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
<style scoped></style>
