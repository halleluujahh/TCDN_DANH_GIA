export interface Pagination {
  pageIndex: number; // Trang hiện tại
  pageSize: number; // Số bản ghi trên mỗi trang
  totalRecords?: number; // Tổng số bản ghi
  totalPages?: number; // Tổng số trang
  itemPerPageOptions?: Array<any>; // Các tùy chọn số bản ghi trên mỗi trang
}
