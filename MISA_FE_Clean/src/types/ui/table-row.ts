export interface TableRow<T> {
  key: string | number;
  data: T;

  // Trạng thái của dòng
  isSelected?: boolean;
}
