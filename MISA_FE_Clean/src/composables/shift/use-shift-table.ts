import { computed } from "vue";
import shiftStore from "../../stores/shift-store";
import type { TableRow } from "../../types/ui/table-row";
import type { Shift } from "../../types/models/shift/shift";
import { CONSTANTS } from "../../constants/common";
import type { ColumnSort } from "../../types/ui/column-sort";
import type { FilterDTO } from "../../types/DTO/shift/filter-dto";
import type { TableColumn } from "../../types/ui/table-column";
import type { ColumnFilterModal } from "../../types/ui/column-filter-modal";

export const useShiftTable = () => {
  const store = shiftStore();
  /**
   * Danh sách trạng thái ca làm việc cho combobox
   * Created By hanv 02/02/2026
   */
  const comboBoxShiftStatus = [
    {
      text: `Đang sử dụng`,
      value: CONSTANTS.STATUS_SHIFT.Active,
      isSelected: false,
    },
    {
      text: `Ngừng sử dụng`,
      value: CONSTANTS.STATUS_SHIFT.Inactive,
      isSelected: false,
    },
  ];
  /**
   * Danh sách tùy chọn sắp xếp và ghim cột cho selectbox group
   * Created By hanv 02/02/2026
   */
  const selectBoxGroupOptions = [
    {
      text: `Không sắp xếp`,
      icon: `empty`,
      value: CONSTANTS.SORT_TYPE.Default,
      isSelected: false,
    },
    {
      text: `Tăng dần`,
      icon: `arrow-up`,
      value: CONSTANTS.SORT_TYPE.Ascending,
      isSelected: false,
    },
    {
      text: `Giảm dần`,
      icon: `arrow-down`,
      value: CONSTANTS.SORT_TYPE.Descending,
      isHasMenuBorder: true,
    },
    {
      text: `Ghim cột`,
      icon: `pin`,
      value: `pin`,
    },
    {
      text: `Bỏ ghim cột`,
      icon: `unpin`,
      value: `unpin`,
    },
  ];
  const moreMenuOptions = [
    {
      text: `Nhân bản`,
      icon: `duplicate`,
      value: null as TableRow<Shift> | null,
    },
    {
      text: `Hoạt động`,
      icon: `empty`,
      value: null as TableRow<Shift> | null,
    },
    {
      text: `Xóa`,
      icon: `trash`,
      value: null as TableRow<Shift> | null,
    },
  ];

  /**
   * Map danh sách ca làm việc sang TableRow để hiển thị trong bảng
   * @returns {TableRow<Shift>[]} Mảng các dòng dữ liệu cho bảng
   * Created By hanv 02/02/2026
   */
  const mapShiftToTableRows = computed<TableRow<Shift>[]>(() => {
    return store.rows.map((shift) => ({
      key: shift.shiftId,
      data: shift,
      isSelected: false,
    }));
  });

  /**
   * Map mảng sắp xếp từ bảng sang DTO lọc và sortOrder trong bảng
   * @param {ColumnSort[]} sortArrayRef - Mảng sắp xếp cột
   * @param {FilterDTO} filterDTORef - DTO lọc dữ liệu
   * @param {TableColumn<Shift>[]} table - Danh sách cột trong bảng
   * Created By hanv 02/02/2026
   */
  const mapSortArrayToFilterDTOFunc = (
    sortArrayRef: ColumnSort[],
    filterDTORef: FilterDTO,
    table: TableColumn<Shift>[],
  ) => {
    let isExist = false;
    sortArrayRef.forEach((item: ColumnSort) => {
      isExist = false;
      // Cập nhật lại mảng lọc trong DTO
      filterDTORef.filterByShiftColumn.forEach((filter) => {
        if (
          filter.name ===
          String(
            CONSTANTS.COLUMN_NAME_SHIFT_FILTER[
              item.columnKey as keyof typeof CONSTANTS.COLUMN_NAME_SHIFT_FILTER
            ],
          )
        ) {
          filter.sortType = item.order;
          isExist = true;
          return;
        }
      });
      // Nếu chưa tồn tại thì thêm mới
      if (!isExist) {
        filterDTORef.filterByShiftColumn.push({
          name: String(
            CONSTANTS.COLUMN_NAME_SHIFT_FILTER[
              item.columnKey as keyof typeof CONSTANTS.COLUMN_NAME_SHIFT_FILTER
            ],
          ),
          sortType: item.order,
        });
      }
      // Cập nhật lại trạng thái sắp xếp trong bảng
      table.find((col) => {
        if (col.key === item.columnKey) {
          col.sortOrder = item.order;
        }
      });
    });
  };
  /**
   * Map ghim cột từ mảng sang trạng thái ghim cột trong bảng
   * @param {ColumnSort[]} sortArrayRef - Mảng sắp xếp cột
   * @param {TableColumn<Shift>[]} table - Danh sách cột trong bảng
   * Created By hanv 02/02/2026
   */
  const mapSortArrayPinToTablePinFunc = (
    sortArrayRef: ColumnSort[],
    table: TableColumn<Shift>[],
  ) => {
    sortArrayRef.forEach((item: ColumnSort) => {
      // Cập nhật lại trạng thái ghim cột trong bảng
      table.find((col: TableColumn<Shift>) => {
        if (col.key === item.columnKey) {
          col.pinning = item.isPin;
        }
      });
    });
  };

  /**
   * Sắp xếp lại cột dựa trên vị trí thực tế và trạng thái ghim
   * @param {TableColumn<Shift>[]} table - Danh sách cột trong bảng
   * @returns {TableColumn<Shift>[]} Mảng cột đã được sắp xếp
   * Created By hanv 02/02/2026
   */
  const columnSortedByPositionFunc = (table: TableColumn<Shift>[]) => {
    if (table.length === 0) return [];

    // Tìm ra những cột đang được ghim
    const pinnedColumn = table.filter((col) => col.pinning);
    const unpinnedColumn = table.filter((col) => !col.pinning);
    // Sắp xếp các cột ghim theo vị trí
    pinnedColumn.sort((a, b) => a.realPos - b.realPos);
    // Sắp xếp các cột không ghim theo vị trí
    unpinnedColumn.sort((a, b) => a.realPos - b.realPos);

    return [...pinnedColumn, ...unpinnedColumn];
  };

  /**
   * Sắp xếp lại các dòng dựa trên vị trí cột đã sắp xếp
   * @param {TableColumn<Shift>[]} tableSorted - Mảng cột đã được sắp xếp
   * @returns {any[]} Mảng các dòng đã được sắp xếp theo thứ tự cột
   * Created By hanv 02/02/2026
   */
  const rowSortedByColumnPositionFunc = (tableSorted: TableColumn<Shift>[]) => {
    const sortedRows = mapShiftToTableRows.value.map((row) => {
      const sortedData: Record<string, any> = {};
      const dataItems = row.data;

      tableSorted.forEach((col) => {
        sortedData[col.key as string] = dataItems[col.key];
      });
      return {
        ...row,
        data: {
          ...row.data,
          items: sortedData as Shift,
        },
      };
    });
    return sortedRows;
  };

  /**
   * Map mảng lọc từ bảng sang DTO lọc
   * @param {ColumnFilterModal[]} filterArrayRef - Mảng lọc cột
   * @param {FilterDTO} filterDTORef - DTO lọc dữ liệu
   * Created By hanv 02/02/2026
   */
  const mapFilterArrayToFilterDTOFunc = (
    filterArrayRef: ColumnFilterModal[],
    filterDTORef: FilterDTO,
  ) => {
    let isExist = false;
    filterArrayRef.forEach((item: ColumnFilterModal) => {
      isExist = false;
      filterDTORef.filterByShiftColumn.forEach((filterItem, idx) => {
        if (
          filterItem.name ===
          String(
            CONSTANTS.COLUMN_NAME_SHIFT_FILTER[
              item.columnKey as keyof typeof CONSTANTS.COLUMN_NAME_SHIFT_FILTER
            ],
          )
        ) {
          filterItem.value = item.valueSearch;
          if (item.filterOption.length > 5) {
            filterItem.dateFilterColumnType = item.filterTypeSearch;
          } else {
            filterItem.filterColumnType = item.filterTypeSearch;
          }
          isExist = true;
        }
      });
      if (!isExist) {
        filterDTORef.filterByShiftColumn.push({
          name: String(
            CONSTANTS.COLUMN_NAME_SHIFT_FILTER[
              item.columnKey as keyof typeof CONSTANTS.COLUMN_NAME_SHIFT_FILTER
            ],
          ),
          value: item.valueSearch,
          filterColumnType:
            item.filterOption.length > 5 ? undefined : item.filterTypeSearch,
          dateFilterColumnType:
            item.filterOption.length > 5 ? item.filterTypeSearch : undefined,
          isSaved: true,
        });
      }
    });
  };

  return {
    mapShiftToTableRows,
    comboBoxShiftStatus,
    selectBoxGroupOptions,
    moreMenuOptions,
    mapSortArrayToFilterDTOFunc,
    mapSortArrayPinToTablePinFunc,
    columnSortedByPositionFunc,
    rowSortedByColumnPositionFunc,
    mapFilterArrayToFilterDTOFunc,
  };
};
