<script setup lang="ts" generic="T">
import type { TableColumn } from "../types/ui/table-column";
import type { TableRow } from "../types/ui/table-row";
import { computed, defineModel, onUnmounted, ref } from "vue";
// @ts-ignore
import BaseCombobox from "./BaseCombobox.vue";
import type { Pagination } from "../types/ui/pagination";
import { cloneDeep } from "lodash";
// @ts-ignore
import BaseBtn from "./BaseBtn.vue";

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: TableRow<T>[];
  idsSelected?: Set<string>;
  pagination: Pagination;
  loading?: boolean;
}

interface TableEmits<T> {
  (e: "toggle-check", row: TableRow<T>): void;
  (e: "toggle-check-all", row: TableRow<T>[]): void;
  (e: "double-click", row: TableRow<T>): void;
  (e: "group-option-change", event: Event, column: TableColumn<T>): void;
  (e: "filter-change", event: Event, column: TableColumn<T>): void;
  (e: "handleChangeCurrentPage", pageIndex: number): void;
}

// @ts-ignore
const props = defineProps<TableProps<T>>();
// @ts-ignore
const emit = defineEmits<TableEmits<T>>();

/**
 * Kiểm tra một hàng có được chọn hay không
 * @param {TableRow<T>} row - Hàng cần kiểm tra
 * @returns {Boolean} Trạng thái check
 * Created By hanv 02/02/2026
 */
// @ts-ignore
const isCheckedRow = (row: TableRow<T>): boolean => {
  return (
    (props.idsSelected as Set<string> | undefined)?.has(row.key.toString()) ??
    false
  );
};

/**
 * Kiểm tra tất cả các hàng có được chọn hay không
 * @returns {Boolean} Trạng thái check tất cả
 * Created By hanv 02/02/2026
 */
const isCheckedAll = (): boolean => {
  return props.rows.length > 0 && props.rows.every((row) => isCheckedRow(row));
};
/**
 * Lấy giá trị của ô
 * @param {TableRow<T>} row - Hàng dữ liệu
 * @param {TableColumn<T>} column - Cột dữ liệu
 * @returns {Any} Giá trị của ô
 * Created By hanv 02/02/2026
 */
// @ts-ignore
const getCellValue = (row: TableRow<T>, column: TableColumn<T>): any => {
  return column.render
    ? column.render(row.data[column.key] as string | number)
    : row.data[column.key];
};
/**
 * Kiểm tra trạng thái active/inactive
 * @param {TableRow<T>} row - Hàng dữ liệu
 * @param {TableColumn<T>} column - Cột dữ liệu
 * @returns {String} Trạng thái active/inactive
 * Created By hanv 02/02/2026
 */
// @ts-ignore
const isActive = (row: TableRow<T>, column: TableColumn<T>): string => {
  if (column.type !== "boolean") return "";
  return row.data[column.key] === 1 ? "active" : "inactive";
};

/**
 * Tính toán trạng thái vô hiệu hóa nút trang trước
 * @returns {Boolean} Trạng thái disabled
 * Created By hanv 02/02/2026
 */
const isDisabledPreviousPageBtn = computed<boolean>(() => {
  return props.pagination.pageIndex === 0;
});
/**
 * Tính toán trạng thái vô hiệu hóa nút trang kế tiếp
 * @returns {Boolean} Trạng thái disabled
 * Created By hanv 02/02/2026
 */
const isDisabledNextPageBtn = computed<boolean>(() => {
  if (
    props.pagination.pageIndex &&
    props.pagination.totalRecords &&
    props.pagination.totalRecords > 0
  ) {
    return (
      props.pagination.pageSize * (props.pagination.pageIndex + 1) >=
      props.pagination.totalRecords
    );
  }
  return false;
});
/**
 * Tính toán số trang trước đó
 * @returns {Number} Chỉ số trang trước
 * Created By hanv 02/02/2026
 */
const calculatePreviousIndexPage = computed<number>(() => {
  return props.pagination.pageIndex > 0 ? props.pagination.pageIndex - 1 : 0;
});
/**
 * Tính toán số trang kế tiếp
 * @returns {Number} Chỉ số trang tiếp theo
 * Created By hanv 02/02/2026
 */
const calculateNextIndexPage = computed<number>(() => {
  return props.pagination.pageIndex + 1;
});

/**
 * Resize column functionality state
 * Theo dõi: isResizing, columnIndex, startX, startWidth
 * Created By hanv 20/01/2026
 */
const resizing = ref({
  isResizing: false,
  columnIndex: null as number | null,
  startX: 0,
  startWidth: 0,
});

/**
 * Bắt đầu resize cột
 * Lưu vị trí ban đầu, thêm mouse listeners, đổi cursor
 * @param {MouseEvent} event - Mousedown event trên resize handle
 * @param {Number} indexColumn - Index của column header
 * Created By hanv 02/02/2026
 */
function startResize(event: MouseEvent, indexColumn: number) {
  event.preventDefault();
  event.stopPropagation();

  resizing.value.isResizing = true;
  resizing.value.columnIndex = indexColumn;
  resizing.value.startX = event.pageX;

  // Lấy width hiện tại của column
  const th = (event.target as HTMLElement).closest("th");
  if (th) {
    resizing.value.startWidth = th.offsetWidth;
  }

  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);

  // Thêm class để thay đổi cursor toàn màn hình
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
}

/**
 * Xử lý resize khi di chuyển chuột
 * Tính toán width mới và cập nhật header style
 * @param {MouseEvent} event - Mousemove event
 * Created By hanv 02/02/2026
 */
function handleResize(event: MouseEvent) {
  if (!resizing.value.isResizing) return;

  const diff = event.pageX - resizing.value.startX;
  const newWidth = resizing.value.startWidth + diff;

  // Đặt min width là 80px
  if (newWidth >= 80) {
    const header = props.columns[resizing.value.columnIndex!];
    if (header && header.width) {
      header.width = `${newWidth}px`;
    }
  }
}

/**
 * Kết thúc resize cột
 * Xóa mouse listeners, reset cursor
 * Created By hanv 20/01/2026
 */
function stopResize() {
  resizing.value.isResizing = false;
  resizing.value.columnIndex = null;

  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);

  // Reset cursor
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
}

/**
 * Cleanup khi component unmount
 * Xóa tất cả event listeners
 * Created By hanv 20/01/2026
 */
onUnmounted(() => {
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
});
</script>

<template>
  <div class="body-list">
    <div class="form-list flex flex-column">
      <div class="flex flex-column">
        <slot name="toolbar-grid"></slot>
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
                      <!-- Emit Event Check  -->
                      <input
                        type="checkbox"
                        class="ms-checkbox-control checkbox"
                        :checked="isCheckedAll()"
                        @click="$emit('toggle-check-all', props.rows)"
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

                  <!-- Column Table -->
                  <th
                    v-for="(column, indexColumn) in props.columns"
                    :key="column.key"
                    :class="['ms-col-th', 'is-text-column', 'ms-th']"
                    :style="{ minWidth: column.width }"
                  >
                    <div v-if="!column.hiding" class="ms-th-content flex-row">
                      <div class="menu-wrapper">
                        <div class="menu-button-container">
                          <div class="ms-th-title flex flex-between">
                            <!-- Changing option in group -->
                            <div
                              class="w-full"
                              @click="
                                $emit('group-option-change', $event, column)
                              "
                            >
                              <div
                                class="caption_arrow_wrap caption_arrow_wrap_undefined"
                              >
                                <span class="flex text-undefined">
                                  {{ column.title }}
                                </span>
                                <div
                                  v-if="column.sortable"
                                  :class="[
                                    'icon16',
                                    `icon-arrow-${column.sortOrder}`,
                                  ]"
                                ></div>
                              </div>
                            </div>
                            <div
                              v-if="column.filterable"
                              class="ms-th-title-icon flex-center"
                            >
                              <div
                                class="icon16 filter--default"
                                @click="$emit('filter-change', $event, column)"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Resize Table Column -->
                      <div
                        @mousedown="startResize($event, indexColumn)"
                        v-if="column.expandable"
                        class="ms-resize"
                      ></div>
                    </div>
                  </th>
                  <th class="ms-th widget-title" rowspan="0"></th>
                </tr>
              </thead>
              <tbody class="ms-tbody data">
                <!-- Skeleton Loading -->
                <template v-if="props.loading">
                  <tr
                    v-for="index in props.rows.length"
                    :key="index"
                    class="shimmer-row"
                  >
                    <td
                      class="ms-td multiple-cell sticky ms-col-td-multiple shimmer-cell"
                    >
                      <div class="shimmer-box shimmer-checkbox"></div>
                    </td>
                    <td class="ms-td shimmer-cell">
                      <div class="shimmer-box"></div>
                    </td>
                    <td class="ms-td widget-item sticky shimmer-cell">
                      <div class="shimmer-box shimmer-actions"></div>
                    </td>
                  </tr>
                </template>

                <!-- Dữ liệu bảng -->
                <template v-else>
                  <tr
                    v-for="row in props.rows"
                    :key="row.key"
                    :class="[
                      'ms-tr',
                      isCheckedRow(row) || isCheckedAll() ? 'row-selected' : '',
                    ]"
                  >
                    <td class="ms-td multiple-cell sticky ms-col-td-multiple">
                      <label class="ms-checkbox justify-center">
                        <input
                          type="checkbox"
                          class="ms-checkbox-control checkbox"
                          :checked="isCheckedRow(row)"
                          @click="$emit('toggle-check', row)"
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
                      v-for="column in props.columns"
                      :key="column.key"
                      class="ms-td ms-col-td level-undefined"
                    >
                      <div v-if="!column.hiding">
                        <div class="text-left text-overflow">
                          <!-- Add Align Item Column Here -->
                          <span :style="{ textAlign: column.textAlign }">
                            <span class="text-view">
                              <!-- Add Class active | inactive Here -->
                              <div
                                :class="[
                                  'custom-status',
                                  isActive(row, column),
                                ]"
                              >
                                {{ getCellValue(row, column) }}
                              </div>
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="ms-td widget-item sticky">
                      <div class="widget-container">
                        <!-- Emit lên cha row Here -->
                        <slot name="row-actions" :row="row"></slot>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- khi không có dữ liệu sẽ hiển thị -->
        <div
          v-if="props.rows.length === 0 && !props.loading"
          class="grid-no-data"
        >
          <img
            src="../assets/icons/pas.bg_report_nodata_new-488b93b4.svg"
            alt=""
            srcset=""
          />
          <div class="empty-des">Không có dữ liệu</div>
        </div>

        <!-- Pagination Section -->
        <div class="ms-pagination flex-row table-paging">
          <div class="flex total-count">
            <div class="total-label">Tổng số:</div>
            <div class="total">
              {{ rows.length || 0 }}
            </div>
          </div>
          <div class="pagination-sticky">
            <div class="flex items-center gap-x-4">
              <div class="page-size-component-title">Số dòng/trang</div>
              <div class="page-size-component">
                <base-combobox
                  :tooltipText="String(props.pagination.pageSize)"
                  :textDisplay="String(props.pagination.pageSize)"
                  :combobox-items="props.pagination.itemPerPageOptions || []"
                  v-model="props.pagination.pageSize"
                />
              </div>
              <div class="page-info">
                1 - {{ props.pagination.pageSize || 10 }}
              </div>
              <div class="btn-next-page">
                <base-btn
                  icon="step-backward"
                  :isHideBorder="true"
                  :isBtnPagination="true"
                  :isDisabled="isDisabledPreviousPageBtn"
                  type="text-neutral"
                  @click="emit('handleChangeCurrentPage', 0)"
                />
                <base-btn
                  icon="angle-left"
                  :isHideBorder="true"
                  :isBtnPagination="true"
                  :isDisabled="isDisabledPreviousPageBtn"
                  type="text-neutral"
                  @click="
                    emit('handleChangeCurrentPage', calculatePreviousIndexPage)
                  "
                />
                <base-btn
                  icon="angle-right"
                  :isHideBorder="true"
                  :isBtnPagination="true"
                  :isDisabled="isDisabledNextPageBtn"
                  type="text-neutral"
                  @click="
                    emit('handleChangeCurrentPage', calculateNextIndexPage)
                  "
                />
                <base-btn
                  icon="step-forward"
                  :isHideBorder="true"
                  :isBtnPagination="true"
                  :isDisabled="
                    props.pagination.totalPages
                      ? props.pagination.pageIndex >=
                        props.pagination.totalPages - 1
                      : false
                  "
                  type="text-neutral"
                  @click="
                    emit(
                      'handleChangeCurrentPage',
                      (props.pagination.totalPages || 1) - 1,
                    )
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body-list {
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -544px 0px;
  background-color: #4b5563;
  display: none;
}
.icon16.filter--active {
  mask-image: url("/src/assets/icons/pas.Icon Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -720px 0px;
  background-color: #4b5563;
  display: block;
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
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -224px 0px;
  background-color: #4b5563;
}
.icon-empty {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -176px 0px;
  background-color: #4b5563;
}
.icon-trash {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -208px 0px;
  background-color: #dc2626 !important;
}
.icon-arrow-1 {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -512px 0px;
  background-color: #4b5563 !important;
}
.icon-arrow-0 {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
  mask-repeat: no-repeat;
  mask-position: -528px 0px;
  background-color: #4b5563 !important;
}
.icon-close {
  mask-image: url("../assets/icons/pas.Icon\ Warehouse-e29a964d.svg");
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

/* Shimmer Loading Styles */
.shimmer-row {
  height: 48px;
}

.shimmer-cell {
  padding: 8px 12px !important;
}

.shimmer-box {
  height: 16px;
  background: #e5e7eb;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.shimmer-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.shimmer-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.shimmer-actions {
  width: 60px;
  margin: 0 auto;
}
.grid-no-data {
  position: absolute;
  text-align: center;
  font-style: normal;
  color: #111827;
  top: 0;
  left: 50%;
  transform: translate(-50%, 100%);
}
.grid-no-data .img-bg {
  background: transparent;
  border: none;
}
</style>
