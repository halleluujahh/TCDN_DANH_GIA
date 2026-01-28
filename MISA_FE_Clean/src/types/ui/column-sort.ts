import { CONSTANTS } from "../../constants/common";

export interface ColumnSort {
  columnKey: string;
  order:
    | typeof CONSTANTS.SORT_TYPE.Default
    | typeof CONSTANTS.SORT_TYPE.Ascending
    | typeof CONSTANTS.SORT_TYPE.Descending;
  isPin: boolean;
  isOpen: boolean;
  style: Record<string, string>;
}
