export interface ColumnFilterModal {
  event: Event | null;
  isClose: boolean;
  columnKey: string;
  columnType: string;
  filterType: "text" | "number";
  filterOption: any[];
  valueSearch: string | number;
  filterTypeSearch: number;
  style: Record<string, string>;
}
