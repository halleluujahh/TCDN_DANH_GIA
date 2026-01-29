export interface FilterDTO {
  searchKeyword: string;
  filterByShiftColumn: Array<{
    name: string;
    value?: string | number;
    sortType?: number;
    filterColumnType?: number;
    dateFilterColumnType?: number;
    isSaved?: boolean;
  }>;
}
