<script setup>
import { reactive, ref, watch, computed, onUpdated } from "vue";
import BaseBtn from "./BaseBtn.vue";
import BaseCombobox from "./BaseCombobox.vue";
import BaseInput from "./BaseInput.vue";
import { cloneDeep } from "lodash";
import { CONSTANTS } from "../../commons/constants";
import { formatFixed2Number } from "../../utils/format";
import BaseModalError from "./BaseModalError.vue";
import BaseSelectBox from "../BaseSelectBox.vue";
import { Enums } from "../../commons/enums";
import { debounce } from "lodash";

const props = defineProps({
  tableData: {
    type: Object,
    default: () => ({}),
  },
  loadData: {
    type: Function,
    default: () => {},
  },
  deleteConfirmModal: {
    type: Object,
    default: () => ({}),
  },
  filterRef: {
    type: Object,
    default: () => ({}),
  },
});

// Bản sao dữ liệu bảng để thao tác chọn dòng
const tableDataClone = reactive(cloneDeep(props.tableData));
const updateInProgress = ref(false);

// Đồng bộ dữ liệu khi props.tableData thay đổi
watch(
  () => props.tableData,
  (newVal) => {
    if (updateInProgress.value) return;
    if (newVal) {
      const newData = cloneDeep(newVal);
      Object.assign(tableDataClone, newData);
    }
  },
  { deep: true },
);
// Xem có chọn tất cả
const isAllSelected = computed(() => {
  return (
    tableDataClone.body.length > 0 &&
    tableDataClone.body.every((item) => item.row.isSelected)
  );
});
// Xem có chọn một phần
const isIndeterminate = computed(() => {
  const selectedCount = tableDataClone.body.filter(
    (item) => item.row.isSelected,
  ).length;
  return selectedCount > 0 && selectedCount < tableDataClone.body.length;
});
// Xem có chọn bất kỳ dòng nào không
const isAnySelection = computed(() => {
  return tableDataClone.body.some((item) => item.row.isSelected);
});
// Đếm tổng số dòng đã chọn
const selectedCount = computed(() => {
  return tableDataClone.body.filter((item) => item.row.isSelected).length;
});
// Lấy mảng id của các row đã chọn
const selectedIds = computed(() => {
  return tableDataClone.body
    .filter((item) => item.row.isSelected)
    .map((item) => {
      // Tìm ShiftId trong rowItems
      const idItem = item.row.rowItems.find(
        (rowItem) => rowItem.columnName === CONSTANTS.COLUMN_NAME_SHIFT.ShiftId,
      );
      return idItem ? idItem.columnData : null;
    })
    .filter((id) => id !== null);
});

// Watch selectedIds và emit khi có thay đổi
watch(selectedIds, (newIds, oldIds) => {
  // Chỉ emit khi giá trị thực sự thay đổi
  if (JSON.stringify(newIds) !== JSON.stringify(oldIds)) {
    emit("selectedIdsChanged", newIds);
  }
});

// Kiểm tra trạng thái của các row đã chọn
const selectedRowsStatus = computed(() => {
  const selectedRows = tableDataClone.body.filter(
    (item) => item.row.isSelected,
  );

  if (selectedRows.length === 0) {
    return { hasActive: false, hasInactive: false };
  }

  let hasActive = false;
  let hasInactive = false;

  selectedRows.forEach((item) => {
    const statusItem = item.row.rowItems.find(
      (rowItem) => rowItem.isActive !== undefined,
    );
    if (statusItem) {
      if (statusItem.isActive) {
        hasActive = true;
      } else {
        hasInactive = true;
      }
    }
  });

  return { hasActive, hasInactive };
});

// Computed để hiển thị nút Active
const showActiveButton = computed(() => {
  return selectedRowsStatus.value.hasInactive;
});

// Computed để hiển thị nút Inactive
const showInactiveButton = computed(() => {
  return selectedRowsStatus.value.hasActive;
});

const isShowBtnRemoveAllConditionFilter = computed(() => {
  // Dùng cả props và tableDataClone để ensure reactivity
  const headers = props.tableData?.header || tableDataClone.header || [];
  return headers.some(
    (item) =>
      item.filterTypeAfterSaved !== null &&
      item.filterTypeAfterSaved !== undefined &&
      item.valueFilterTypeAfterSaved !== null &&
      item.valueFilterTypeAfterSaved !== undefined,
  );
});

// Computed cho filter tooltip text
const filterTooltipText = computed(() => {
  const filterType = tableDataClone.styleColumnValueModal?.filterType;
  const selectedItem = tableDataClone.styleColumnValueModal?.items?.find(
    (item) => item.isSelected === true,
  );
  const value = filterType ?? selectedItem?.value;
  return props.tableData.styleColumnValueModal.typeInput ===
    CONSTANTS.BASE_INPUT_TYPE.DATE
    ? String(CONSTANTS.DATE_FILTER_COLUMN_TYPE_TEXT[value] || "")
    : String(CONSTANTS.FILTER_COLUMN_TYPE_TEXT[value] || "");
});

// Computed cho selectbox visibility
const isSelectBoxOpen = computed(() => {
  const item = tableDataClone.body?.[tableDataClone.indexTbdItem];
  return (
    item?.row?.btnActions?.[tableDataClone.indexBtnAction]?.isOpenSelectBox ||
    false
  );
});

// Computed cho sort menu visibility
const isSortMenuOpen = computed(() => {
  return (
    tableDataClone.header?.[tableDataClone.indexTbhItem]?.isOpenSortMenu ||
    false
  );
});

// Computed cho filter modal visibility
const isFilterModalOpen = computed(() => {
  return (
    tableDataClone.header?.[tableDataClone.indexTbhItem]
      ?.isOpenFilterColumnValueModal || false
  );
});

// Computed cho trang cuối cùng
const lastPage = computed(() => {
  const { totalCount, pageSize } = props.tableData.pagination;
  return Math.ceil(totalCount / pageSize) - 1;
});

// Toggle checkbox (cho phép chọn/bỏ chọn)
function toggleCheckbox(index) {
  updateInProgress.value = true;
  tableDataClone.body[index].row.isSelected =
    !tableDataClone.body[index].row.isSelected;
  setTimeout(() => {
    updateInProgress.value = false;
  }, 0);
}

// Biến để track double click
const clickTimer = ref(null);
const clickCount = ref(0);
const lastClickedIndex = ref(null);

// Chọn row (phát hiện double click)
function selectRow(index) {
  updateInProgress.value = true;

  // Tăng số lần click
  clickCount.value++;
  lastClickedIndex.value = index;

  // Nếu click vào row khác, reset count
  if (lastClickedIndex.value !== index) {
    clickCount.value = 1;
  }

  // Clear timeout cũ nếu có
  if (clickTimer.value) {
    clearTimeout(clickTimer.value);
  }

  // Nếu là click lần 2 trong thời gian ngắn (double click)
  if (clickCount.value === 2) {
    clickCount.value = 0;
    updateInProgress.value = false;

    // Emit event double click
    const rowData = tableDataClone.body[index].row.btnActions[0].shiftUpdated;
    emit("emitActionBtn", "openEditModal", rowData, index, null, null);
    return;
  }

  // Set timeout để reset count sau 300ms
  clickTimer.value = setTimeout(() => {
    clickCount.value = 0;
    lastClickedIndex.value = null;
  }, 300);

  // Chọn row này (single click)
  tableDataClone.body[index].row.isSelected = true;

  setTimeout(() => {
    updateInProgress.value = false;
  }, 0);
}
// Chọn hoặc bỏ chọn tất cả dòng
function toggleSelectAllTr() {
  updateInProgress.value = true;
  const allSelected = isAllSelected.value;
  tableDataClone.body.forEach((item) => {
    item.row.isSelected = !allSelected;
  });
  setTimeout(() => {
    updateInProgress.value = false;
  }, 0);
}
function unSelectedAll() {
  updateInProgress.value = true;
  tableDataClone.body.forEach((item) => {
    item.row.isSelected = false;
  });
  setTimeout(() => {
    updateInProgress.value = false;
  }, 0);
}
const emit = defineEmits([
  "emitActionBtn",
  "selectedIdsChanged",
  "handleChangeCurrentPage",
]);
function emitBtnFooterAction(action) {
  emit("emitActionBtn", action);
}
// Phát ra sự kiện khi bấm nút hành động mỗi hàng trong bảng
function handleEmitActionBtn(
  action,
  shiftUpdated,
  indexTbdItem,
  indexBtnAction,
  event,
  sortType,
) {
  emit(
    "emitActionBtn",
    action,
    shiftUpdated,
    indexTbdItem,
    indexBtnAction,
    event,
    sortType,
  );
}

// Debounce cho search input
const handleSearchDebounced = debounce((value) => {
  handleEmitActionBtn("searchByKeyword", null, null, null, value);
}, 500);

function handleSearchInput(event) {
  handleSearchDebounced(event.target.value);
}
</script>

<template>
  <div class="body-layout-list">
    <div class="body-list">
      <div class="form-list flex flex-column">
        <div class="flex flex-column">
          <div class="condition-box flex-row">
            <div class="flex control-gap items-center">
              <div
                class="ms-input ms-editor w-100 flex items-center gap-4 search-input-list"
              >
                <BaseInput
                  autoComplete="on"
                  placeholder="Tìm kiếm"
                  icon="search"
                  @input="handleSearchInput"
                />
              </div>
              <div v-show="isAnySelection" class="feature-batch flex">
                <div class="selected-count">
                  Đã chọn
                  <span class="bold">{{ selectedCount }}</span>
                </div>
                <div class="unselected" @click="unSelectedAll">Bỏ chọn</div>
                <BaseBtn
                  v-if="showActiveButton"
                  icon="active"
                  text="Sử dụng"
                  type="outline-success"
                  @click="
                    handleEmitActionBtn(
                      'activeMultiple',
                      null,
                      null,
                      null,
                      null,
                    )
                  "
                />
                <BaseBtn
                  v-if="showInactiveButton"
                  icon="inactive"
                  text="Ngừng sử dụng"
                  type="outline-danger"
                  @click="
                    handleEmitActionBtn(
                      'inactiveMultiple',
                      null,
                      null,
                      null,
                      null,
                    )
                  "
                />
                <BaseBtn
                  @click="
                    handleEmitActionBtn(
                      'confirmDeleteMultiple',
                      null,
                      null,
                      null,
                      null,
                    )
                  "
                  icon="trash"
                  text="Xóa"
                  type="outline-danger"
                />
              </div>
              <div class="filter-conditions h-full">
                <template
                  v-for="(itemHeader, indexHeader) in tableDataClone.header"
                >
                  <div
                    v-if="
                      itemHeader.filterTypeAfterSaved !== null &&
                      itemHeader.filterTypeAfterSaved !== undefined &&
                      itemHeader.valueFilterTypeAfterSaved !== null &&
                      itemHeader.valueFilterTypeAfterSaved !== undefined
                    "
                    :key="indexHeader"
                    class="filter-item"
                  >
                    <div class="lable-value-filter">
                      <span>{{ itemHeader.text }}</span>
                      <div style="color: #009b71">
                        {{
                          itemHeader.typeFilter ===
                          CONSTANTS.BASE_INPUT_TYPE.DATE
                            ? CONSTANTS.DATE_FILTER_COLUMN_TYPE_TEXT[
                                itemHeader.filterTypeAfterSaved
                              ]
                            : CONSTANTS.FILTER_COLUMN_TYPE_TEXT[
                                itemHeader.filterTypeAfterSaved
                              ]
                        }}
                      </div>
                      <span>{{ itemHeader.valueFilterTypeAfterSaved }}</span>
                    </div>
                    <div
                      class="icon16 pointer icon-close"
                      @click="
                        handleEmitActionBtn(
                          'removeConditionFilter',
                          null,
                          indexHeader,
                          null,
                          null,
                        )
                      "
                    ></div>
                  </div>
                </template>
                <div
                  v-if="isShowBtnRemoveAllConditionFilter"
                  class="delete-all-filter"
                  @click="
                    handleEmitActionBtn(
                      'removeAllConditionFilter',
                      null,
                      null,
                      null,
                      null,
                    )
                  "
                >
                  Bỏ lọc
                </div>
              </div>
            </div>
            <div v-show="!isAnySelection" class="action flex-row">
              <BaseBtn
                icon="reload"
                text=""
                type="outline-neutral"
                tooltipText="Lấy lại dữ liệu"
                @click="
                  handleEmitActionBtn('reloadData', null, null, null, null)
                "
              />
            </div>
          </div>
        </div>
      </div>
      <div class="voucher-body-grid">
        <div
          class="ms-grid-viewer flex flex-column has-scroll-x has-scroll-y has-paging flex-box"
        >
          <div class="ms-content-table scroller">
            <div class="grid-scroll">
              <table class="ms-table" cellpadding="0" cellspacing="0">
                <thead class="ms-thead">
                  <tr class="ms-tr">
                    <th
                      class="ms-th multiple-cell sticky ms-th-col"
                      rowspan="0"
                      scope="col"
                    >
                      <label class="ms-checkbox justify-center">
                        <input
                          type="checkbox"
                          :checked="isAllSelected"
                          :indeterminate="isIndeterminate"
                          class="ms-checkbox-control checkbox"
                          @click="toggleSelectAllTr"
                        />
                        <div class="ms-checkbox-wrapper">
                          <span class="ms-checkbox-container">
                            <div class="ms-checkbox-inner">
                              <div class="checkmark mi-checkbox-active"></div>
                            </div>
                          </span>
                        </div>
                      </label>
                    </th>
                    <th
                      v-for="(
                        tableHeadItems, indexTbhItems
                      ) in tableDataClone.header"
                      :key="indexTbhItems"
                      :class="[
                        'ms-col-th',
                        'is-text-column',
                        'ms-th',
                        tableHeadItems.columnName,
                      ]"
                      :style="{
                        width:
                          tableHeadItems.style.width !== undefined &&
                          tableHeadItems.style.width,
                        minWidth:
                          tableHeadItems.style.minWidth !== undefined &&
                          tableHeadItems.style.minWidth,
                        maxWidth:
                          tableHeadItems.style.maxWidth !== undefined &&
                          tableHeadItems.style.maxWidth,
                      }"
                    >
                      <div class="ms-th-content flex-row">
                        <div class="menu-wrapper">
                          <div class="menu-button-container">
                            <div class="ms-th-title flex flex-between">
                              <div
                                class="w-full"
                                @click="
                                  handleEmitActionBtn(
                                    tableHeadItems.action,
                                    null,
                                    indexTbhItems,
                                    null,
                                    $event,
                                  )
                                "
                              >
                                <div
                                  class="caption_arrow_wrap caption_arrow_wrap_undefined"
                                >
                                  <span class="flex text-undefined">{{
                                    tableHeadItems.text
                                  }}</span>
                                  <div
                                    v-if="
                                      props.filterRef &&
                                      props.filterRef.FilterByShiftColumn.some(
                                        (item) =>
                                          item.SortType ===
                                            Enums.SortType.Descending &&
                                          item.Name ===
                                            tableHeadItems.columnName,
                                      )
                                    "
                                    class="icon16 icon-arrow-down"
                                  ></div>
                                  <div
                                    v-else-if="
                                      props.filterRef &&
                                      props.filterRef.FilterByShiftColumn.some(
                                        (item) =>
                                          item.SortType ===
                                            Enums.SortType.Ascending &&
                                          item.Name ===
                                            tableHeadItems.columnName,
                                      )
                                    "
                                    class="icon16 icon-arrow-up"
                                  ></div>
                                </div>
                              </div>
                              <div
                                v-if="
                                  tableHeadItems.filterColumnValueAction &&
                                  tableHeadItems.filterColumnValueAction !==
                                    undefined &&
                                  tableHeadItems.filterColumnValueAction !== ''
                                "
                                class="ms-th-title-icon flex-center"
                                @click="
                                  handleEmitActionBtn(
                                    tableHeadItems.filterColumnValueAction,
                                    null,
                                    indexTbhItems,
                                    null,
                                    $event,
                                  )
                                "
                              >
                                <div class="icon16 filter--default"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="ms-resize"></div>
                      </div>
                    </th>
                    <th class="ms-th widget-title" rowspan="0"></th>
                  </tr>
                </thead>
                <tbody class="ms-tbody data">
                  <tr
                    v-for="(tableDataItem, indexTbdItem) in tableDataClone.body"
                    :key="indexTbdItem"
                    :class="[
                      'ms-tr',
                      tableDataItem.row.isSelected ? 'row-selected' : '',
                    ]"
                  >
                    <td
                      class="ms-td multiple-cell sticky ms-col-td-multiple"
                      @click.stop="toggleCheckbox(indexTbdItem)"
                    >
                      <label class="ms-checkbox justify-center">
                        <input
                          type="checkbox"
                          :checked="tableDataItem.row.isSelected"
                          class="ms-checkbox-control checkbox"
                          @click="toggleCheckbox(indexTbdItem)"
                        />
                        <div class="ms-checkbox-wrapper">
                          <span class="ms-checkbox-container">
                            <span class="ms-checkbox-inner">
                              <div class="checkmark mi-checkbox-active"></div>
                            </span>
                          </span>
                        </div>
                      </label>
                    </td>
                    <td
                      v-for="(
                        rowItem, indexRowItem
                      ) in tableDataItem.row.rowItems.filter(
                        (item) =>
                          item.columnName !==
                          CONSTANTS.COLUMN_NAME_SHIFT.ShiftId,
                      )"
                      :key="indexRowItem"
                      class="ms-td ms-col-td level-undefined"
                      :title="rowItem.columnData"
                      @click="selectRow(indexTbdItem)"
                    >
                      <div>
                        <div class="text-left text-overflow">
                          <span :class="[rowItem.textAlign]">
                            <span class="text-view">
                              <div v-if="rowItem.isActive === undefined">
                                {{
                                  rowItem.columnData &&
                                  rowItem.columnData !== ""
                                    ? [
                                        CONSTANTS.COLUMN_NAME_SHIFT
                                          .ShiftBreakingTime,
                                        CONSTANTS.COLUMN_NAME_SHIFT
                                          .ShiftWorkingTime,
                                      ].includes(rowItem.columnName)
                                      ? formatFixed2Number(rowItem.columnData)
                                      : rowItem.columnData
                                    : [
                                          CONSTANTS.COLUMN_NAME_SHIFT
                                            .ShiftBreakingTime,
                                          CONSTANTS.COLUMN_NAME_SHIFT
                                            .ShiftWorkingTime,
                                        ].includes(rowItem.columnName)
                                      ? "0,00"
                                      : "-"
                                }}
                              </div>
                              <div
                                :class="[
                                  rowItem.isActive ? 'active' : 'inactive',
                                  'custom-status',
                                ]"
                                v-else-if="rowItem.isActive !== undefined"
                              >
                                {{ rowItem.columnData }}
                              </div>
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="ms-td widget-item sticky">
                      <div class="widget-container">
                        <BaseBtn
                          v-for="(
                            btnActionItem, indexBtnAction
                          ) in tableDataItem.row.btnActions"
                          :key="indexBtnAction"
                          :icon="btnActionItem.icon"
                          :type="btnActionItem.type"
                          :isHideBorder="btnActionItem.isHideBorder"
                          :isBtnActionTable="btnActionItem.isBtnActionTable"
                          :tooltipText="btnActionItem.tooltipText"
                          :isOpenSelectBox="btnActionItem.isOpenSelectBox"
                          @click="
                            handleEmitActionBtn(
                              btnActionItem.action,
                              btnActionItem.shiftUpdated,
                              indexTbdItem,
                              indexBtnAction,
                              $event,
                            )
                          "
                          ref="buttonRowRef"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="ms-pagination flex-row table-paging">
            <div class="flex total-count">
              <div class="total-label">Tổng số:</div>
              <div class="total">
                {{ tableDataClone.pagination.totalCount }}
              </div>
            </div>
            <div class="pagination-sticky">
              <div class="flex items-center gap-x-4">
                <div class="page-size-component-title">Số dòng/trang</div>
                <div class="page-size-component">
                  <BaseCombobox
                    :tooltipText="String(props.tableData.pagination.pageSize)"
                    :textDisplay="String(props.tableData.pagination.pageSize)"
                    :comboboxItems="
                      props.tableData.pagination.itemPerPageOptions
                    "
                    v-model="props.tableData.pagination.pageSize"
                  />
                </div>
                <div class="page-info">
                  1 - {{ props.tableData.pagination.pageSize }}
                </div>
                <div class="btn-next-page">
                  <BaseBtn
                    icon="step-backward"
                    :isHideBorder="true"
                    :isBtnPagination="true"
                    :isDisabled="props.tableData.pagination.currentPage === 0"
                    type="text-neutral"
                    @click="emit('handleChangeCurrentPage', 0)"
                  />
                  <BaseBtn
                    icon="angle-left"
                    :isHideBorder="true"
                    :isBtnPagination="true"
                    :isDisabled="
                      props.tableData.pagination.currentPage == 0 ? true : false
                    "
                    type="text-neutral"
                    @click="
                      emit(
                        'handleChangeCurrentPage',
                        props.tableData.pagination.currentPage - 1,
                      )
                    "
                  />
                  <BaseBtn
                    icon="angle-right"
                    :isHideBorder="true"
                    :isBtnPagination="true"
                    :isDisabled="
                      props.tableData.pagination.pageSize *
                        (props.tableData.pagination.currentPage + 1) >
                      props.tableData.pagination.totalCount
                        ? true
                        : false
                    "
                    type="text-neutral"
                    @click="
                      emit(
                        'handleChangeCurrentPage',
                        props.tableData.pagination.currentPage + 1,
                      )
                    "
                  />
                  <BaseBtn
                    icon="step-forward"
                    :isHideBorder="true"
                    :isBtnPagination="true"
                    :isDisabled="
                      props.tableData.pagination.currentPage >= lastPage
                    "
                    type="text-neutral"
                    @click="emit('handleChangeCurrentPage', lastPage)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Selectbox -->
    <Transition name="popup-speedup">
      <BaseSelectBox
        v-if="isSelectBoxOpen"
        class="menu-wrapper-menu widget-more-container"
        :style="tableDataClone.styleMoreContainer"
        :items="tableDataClone.styleMoreContainer.items"
        @action="handleEmitActionBtn"
      >
      </BaseSelectBox>
    </Transition>
    <Transition name="popup-speedup">
      <BaseSelectBox
        v-if="isSortMenuOpen"
        class="menu-wrapper-menu widget-more-container"
        :style="tableDataClone.styleHeaderContainer"
        :items="tableDataClone.styleHeaderContainer.items"
        @action="handleEmitActionBtn"
      >
      </BaseSelectBox>
    </Transition>

    <Transition name="popup-speedup">
      <!-- Filter Box Column -->
      <div
        class="gap-container flex-column padding-vertial padding-horizontal condition-container text"
        :style="{
          top: tableDataClone.styleColumnValueModal.top,
          left: tableDataClone.styleColumnValueModal.left,
          right: tableDataClone.styleColumnValueModal.right,
          bottom: tableDataClone.styleColumnValueModal.bottom,
        }"
        v-if="isFilterModalOpen"
      >
        <div class="flex flex-between relative">
          <div class="column-filter-text">
            Lọc {{ tableDataClone.styleColumnValueModal.columnName }}
          </div>
          <div
            class="close-condition-btn"
            @click="
              handleEmitActionBtn(
                'closeFilterColumnValue',
                null,
                null,
                null,
                null,
              )
            "
          >
            <div class="ms-button btn-text-neutral only-icon">
              <div class="icon icon-close icon16"></div>
            </div>
          </div>
        </div>
        <div class="filter-container">
          <div class="control-gap-item view-fitler-text">
            <div class="column-filter flex">
              <div class="filter-operator">
                <BaseCombobox
                  :tooltipText="filterTooltipText"
                  :textDisplay="filterTooltipText"
                  :comboboxItems="tableDataClone.styleColumnValueModal.items"
                  :typeFilter="tableDataClone.styleColumnValueModal.typeInput"
                  v-model="props.tableData.styleColumnValueModal.filterType"
                />
              </div>
            </div>
            <div class="filter-value">
              <div
                :class="[
                  'ms-' + props.tableData.styleColumnValueModal.typeInput,
                  props.tableData.styleColumnValueModal.typeInput ===
                  CONSTANTS.BASE_INPUT_TYPE.CHECKBOX
                    ? ''
                    : 'ms-editor',
                  'w-100',
                  'flex',
                  'items-center',
                  'gap-4',
                  'ms-validate',
                  'mb-16px',
                ]"
              >
                <BaseInput
                  v-if="
                    props.tableData.styleColumnValueModal.typeInput !==
                    CONSTANTS.BASE_INPUT_TYPE.COMBOBOX
                  "
                  autoComplete="on"
                  placeholder="Nhập giá trị lọc"
                  :type="props.tableData.styleColumnValueModal.typeInput"
                  v-model="
                    props.tableData.styleColumnValueModal.valueFilterType
                  "
                />
              </div>
              <BaseCombobox
                v-if="
                  props.tableData.styleColumnValueModal.typeInput ===
                  CONSTANTS.BASE_INPUT_TYPE.COMBOBOX
                "
                :type="props.tableData.styleColumnValueModal.typeInput"
                :comboboxItems="
                  props.tableData.styleColumnValueModal.comboboxItems
                "
                :isDisplayStatus="
                  props.tableData.styleColumnValueModal.isDisplayStatus
                "
                :tooltipText="
                  CONSTANTS.STATUS_SHIFT[
                    props.tableData.styleColumnValueModal.valueFilterType
                  ]
                "
                :textDisplay="
                  CONSTANTS.STATUS_SHIFT[
                    props.tableData.styleColumnValueModal.valueFilterType
                  ]
                "
                v-model="props.tableData.styleColumnValueModal.valueFilterType"
              />
            </div>
          </div>
        </div>
        <div class="buttons flex">
          <div class="ml-auto flex gap-x-2">
            <BaseBtn
              text="Hủy"
              type="outline-neutral"
              @click="
                handleEmitActionBtn(
                  'closeFilterColumnValue',
                  null,
                  null,
                  null,
                  null,
                )
              "
            />
            <BaseBtn
              text="Áp dụng"
              type="solid-brand"
              @click="
                handleEmitActionBtn(
                  'saveFilterColumnValue',
                  null,
                  null,
                  null,
                  null,
                )
              "
            />
          </div>
          <div>
            <BaseBtn
              @click="
                handleEmitActionBtn(
                  'removeConditionFilter',
                  null,
                  props.tableData.indexTbhItem,
                  null,
                  null,
                )
              "
              text="Bỏ lọc"
              type="filled-neutral"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal -->
    <BaseModalError
      :iconTitle="props.deleteConfirmModal.iconTitle"
      :title="props.deleteConfirmModal.title"
      :message="props.deleteConfirmModal.message"
      :iconTooltip="props.deleteConfirmModal.iconTooltip"
      :footerButtons="props.deleteConfirmModal.buttonFooterModalError"
      @action="emitBtnFooterAction"
    />
  </div>
</template>

<style scoped>
.body-layout-list {
  flex: 1;
  height: 0;
}
.body-list {
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}
/* ==================== Search Filter Section ====================*/
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
/* ==================== Table Section ====================*/
.voucher-body-grid {
  flex: 1;
  height: 0;
}
.ms-grid-viewer {
  background-color: #fff;
  position: relative;
  border-radius: 2px;
  width: 100%;
  height: 100%;
  justify-content: space-between;
}
.ms-content-table {
  position: relative;
  height: 100%;
  display: flex;
  border-radius: 0;
  border-left: 0;
  border-right: 0;
}
.scroller {
  overflow: auto;
  scrollbar-width: thin;
}
.ms-content-table .grid-scroll {
  visibility: visible;
  position: relative;
  flex: 1;
}
.ms-table {
  min-width: 100%;
  max-height: 100%;
}
.ms-thead th.sticky {
  z-index: 4 !important;
}
.ms-thead th.ms-th {
  font-weight: 400;
  background: #f3f4f6;
  border-bottom: 1px solid #d1d5db;
  position: sticky;
  top: 0;
  z-index: 2;
  cursor: pointer;
}
.ms-thead th.ms-th.multiple-cell {
  width: 40px !important;
  max-width: 40px !important;
  min-width: 40px !important;
  z-index: 4;
  left: 0;
}
.ms-thead th.ms-th.ms-col-th,
.ms-thead th.ms-th.multiple-cell {
  height: 30px;
}
.ms-thead {
  height: 30px;
  color: #262626;
  user-select: none;
}
.ms-thead th.ms-th.multiple-cell {
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
}
.ms-thead tr:first-child th:first-child {
  border-top-left-radius: 0;
}
.ms-thead th.ms-th.serial-title .ms-checkbox,
.ms-thead th.ms-th.multiple-cell .ms-checkbox {
  border-right: 1px solid #d1d5db !important;
}
.ms-col-th {
  height: 33px !important;
}
.ms-th-content {
  max-width: 100%;
  padding: 0 16px;
  border-right: 1px solid #d1d5db;
}
.menu-wrapper {
  width: 100%;
}
.ms-th-title {
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  font-weight: 600;
  width: 100%;
  position: relative;
}
.caption_arrow_wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ms-th-title-icon {
  height: 100%;
}
.icon16.filter--default {
  mask-image: url("/src/assets/icon/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -544px 0px;
  background-color: #4b5563;
  display: none;
}
.ms-col-th.is-text-column:hover .icon16.filter--default {
  display: block;
}
.ms-resize {
  width: 5px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  cursor: col-resize;
}
.ms-th.widget-title {
  z-index: 3;
  border-right: none !important;
  text-align: left;
  padding: 0 16px;
  font-weight: 600;
  text-align: right;
  right: 0;
  top: 0;
  width: 100px;
  min-width: 100px;
}
.ms-thead tr:first-child th:last-child {
  border-top-right-radius: 0;
}
.ms-thead tr:first-child th:last-child {
  border-top-right-radius: 4px;
  border-right: none !important;
}
tbody .ms-tr {
  color: #111827;
}
.multiple-cell {
  text-align: center;
  position: sticky;
  left: 0;
  background-color: #fff;
}
.ms-td {
  padding: 0 16px;
  height: 32px;
  vertical-align: middle;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.ms-td.widget-item {
  padding: 0 6px 0 12px;
  background-color: transparent;
}
.ms-tr td {
  overflow: hidden;
  background-color: #fff !important;
}
.ms-td.multiple-cell {
  padding: 0;
  z-index: 1;
}
.ms-td .ms-col-td .level-undefined {
  max-width: 120px;
}
.ms-td div {
  line-height: 1.5;
}
.ms-td .text-overflow {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #111827;
}
.ms-tr:not(.action-hover) .ms-td .text-overflow[data-v-6b14f1ae] {
  width: 100% !important;
}
.ms-tr.row-selected:hover td {
  outline: none !important;
  background-color: #a4f6d3 !important;
}
.ms-tr.row-selected td {
  background-color: #a4f6d3 !important;
}
.ms-tr:hover td {
  background-color: #e5e7eb !important;
}
.ms-td.widget-item.sticky {
  z-index: 1;
  padding: 0 16px;
  right: 0;
}
.widget-container {
  display: flex;
  justify-content: flex-start;
  padding-left: 8px;
  align-items: center;
  gap: 8px;
  transition: visibility 0s ease;
}
.ms-col-td .active {
  background-color: #ebfef6;
  color: #009b71;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 999px;
}
.active {
  background-color: #ebfef6;
  color: #009b71;
  padding: 5px 8px;
  border-radius: 999px;
}
.ms-col-td .inactive {
  background-color: #fee2e2;
  color: #dc2626;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 999px;
}
.inactive {
  background-color: #fee2e2;
  color: #dc2626;
  width: fit-content;
  padding: 5px 8px;
  border-radius: 999px;
}
/* ==================== Pagination Section ====================*/
.ms-pagination {
  height: 44px;
  min-height: 44px;
  align-items: center;
  background-color: #f3f4f6;
}
.ms-pagination .total-count {
  position: sticky;
  left: 16px;
}
.ms-pagination .total-label {
  color: #262626;
}
.ms-pagination .total {
  margin-left: 4px;
  font-weight: 700;
  color: #111827;
}
.ms-pagination .pagination-sticky {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: sticky;
  right: 16px;
  min-width: 350px;
}
.ms-pagination .page-size-component {
  width: 80px;
}
.ms-pagination .page-info {
  font-weight: 700;
}
.ms-pagination .btn-next-page {
  display: flex;
  align-items: center;
  justify-content: center;
}
.text-view {
  color: #111827;
  overflow: hidden;
  white-space: normal;
}
.table-paging {
  bottom: 0;
  width: 100%;
  left: 0;
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 0 0 4px 4px;
}

.menu-wrapper-menu {
  list-style: none;
  animation: slide-down 0.2s ease;
  position: absolute;
  z-index: 9999;
  background-color: #fff;
  box-shadow:
    0 0 8px #0000001a,
    0 8px 16px #0000001a;
  border-radius: 4px;
  margin: 0;
}
.menu-wrapper-item {
  outline: none;
  padding: 8px 12px;
  color: inherit;
  text-decoration: none;
  height: 32px;
  cursor: pointer;
  display: block;
  transition: all 0.7s ease;
  display: flex;
  column-gap: 8px;
}
.menu-wrapper-item:hover {
  outline: 0;
  background-color: #f3f4f6;
  border-radius: 2px;
  transition: all 0.2s ease;
}
.menu-wrapper-item.flex {
  display: flex !important;
}
.menu-wrapper-item.menu-wrapper-item-icon {
  white-space: nowrap;
  align-items: center;
}
.icon-duplicate {
  mask-image: url("../../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -224px 0px;
  background-color: #4b5563;
}
.icon-empty {
  mask-image: url("../../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -176px 0px;
  background-color: #4b5563;
}
.icon-trash {
  mask-image: url("../../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -208px 0px;
  background-color: #dc2626 !important;
}
.icon-arrow-up {
  mask-image: url("../../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -512px 0px;
  background-color: #4b5563 !important;
}
.icon-arrow-down {
  mask-image: url("../../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -528px 0px;
  background-color: #4b5563 !important;
}
.icon-close {
  mask-image: url("../../assets/icon/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -96px 0px;
  background-color: #4b5563 !important;
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
</style>
