import type { CONSTANTS } from "../../constants/common";

export interface TableColumn<T> {
  // Thuộc tính của đối tượng T sẽ được sử dụng làm key
  key: keyof T;
  title: string;

  // Tùy chọn hiển thị
  width?: string | number;
  textAlign?: "left" | "center" | "right";
  type: "text" | "number" | "time" | "date" | "boolean" | "custom";
  realPos: number;

  // Tùy chọn chức năng
  groupable?: boolean;
  groupOptions?: any[];

  // Sắp xếp
  sortable?: boolean;
  sortOrder?:
    | typeof CONSTANTS.SORT_TYPE.Default
    | typeof CONSTANTS.SORT_TYPE.Ascending
    | typeof CONSTANTS.SORT_TYPE.Descending;

  // Lọc theo cột
  filterable?: boolean;
  filterType?: "text" | "number" | "date" | "boolean";
  filterOptions?: any[];

  // Cột mở rộng
  expandable?: boolean;

  // Ghim cột
  pinning?: boolean;
  
  // Ẩn cột
  hiding?: boolean;

  render?: (rowData: string | number) => string;
}
