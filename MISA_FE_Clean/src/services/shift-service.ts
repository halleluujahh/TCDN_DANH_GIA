import { shiftApi } from "../apis/modules/shift-api";
import type { Response } from "../types/DTO/response";
import type { filterDTO } from "../types/DTO/shift/filter-dto";
import type { Shift } from "../types/models/shift/shift";
import type { BaseService } from "./interface/base-service";

export class ShiftService implements BaseService<Shift> {
  /**
   * Lấy danh sách ca làm việc có phân trang
   * @param {Object} params - Tham số phân trang
   * @returns {Promise<Response<Shift>>} Danh sách ca làm việc
   * Created By hanv 02/02/2026
   */
  async getAllPagination(params: Object): Promise<Response<Shift>> {
    return await shiftApi.get("/all-pagination", params);
  }

  /**
   * Lấy danh sách ca làm việc có phân trang và lọc
   * @param {Object} params - Tham số phân trang và filter
   * @param {number} params.pageSize - Kích thước trang
   * @param {number} params.currentPage - Trang hiện tại
   * @param {filterDTO} params.filter - Điều kiện lọc
   * @returns {Promise<Response<Shift>>} Danh sách ca làm việc
   * Created By hanv 02/02/2026
   */
  async getAllPaginationFilter(params: {
    pageSize: number;
    currentPage: number;
    filter: filterDTO;
  }): Promise<Response<Shift>> {
    return await shiftApi.post(
      `/all-pagination-filter?pageSize=${params.pageSize}&currentPage=${params.currentPage}`,
      params.filter,
    );
  }
  
  /**
   * Thêm mới ca làm việc
   * @param {Shift} item - Thông tin ca làm việc cần thêm
   * @returns {Promise<Response<Shift>>} Kết quả thêm mới
   * Created By hanv 02/02/2026
   */
  async create(item: Shift): Promise<Response<Shift>> {
    return await shiftApi.post(`/save-shift`, item);
  }
  
  /**
   * Cập nhật ca làm việc
   * @param {string} id - ID ca làm việc
   * @param {Shift} item - Thông tin ca làm việc cần cập nhật
   * @returns {Promise<Response<Shift>>} Kết quả cập nhật
   * Created By hanv 02/02/2026
   */
  async update(id: string, item: Shift): Promise<Response<Shift>> {
    return await shiftApi.put(`update/${id}`, item);
  }
  
  /**
   * Cập nhật trạng thái hoạt động ca làm việc
   * @param {Set<string>} ids - Danh sách ID ca làm việc
   * @returns {Promise<Response<Shift>>} Kết quả cập nhật
   * Created By hanv 02/02/2026
   */
  async updateStatusActive(ids: Set<string>): Promise<Response<Shift>> {
    return await shiftApi.updateStatus("/update-status-active", ids);
  }
  
  /**
   * Cập nhật trạng thái không hoạt động ca làm việc
   * @param {Set<string>} ids - Danh sách ID ca làm việc
   * @returns {Promise<Response<Shift>>} Kết quả cập nhật
   * Created By hanv 02/02/2026
   */
  async updateStatusInactive(ids: Set<string>): Promise<Response<Shift>> {
    return await shiftApi.updateStatus("/update-status-inactive", ids);
  }
  
  /**
   * Xoá nhiều ca làm việc
   * @param {Set<string>} ids - Danh sách ID ca làm việc cần xóa
   * @returns {Promise<Response<null>>} Kết quả xóa
   * Created By hanv 02/02/2026
   */
  async delete(ids: Set<string>): Promise<Response<null>> {
    return await shiftApi.deleteMultiple("/delete", ids);
  }
}

export const shiftService = new ShiftService();
