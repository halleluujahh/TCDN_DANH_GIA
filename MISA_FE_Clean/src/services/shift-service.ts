import { shiftApi } from "../apis/modules/shift-api";
import type { Response } from "../types/DTO/response";
import type { filterDTO } from "../types/DTO/shift/filter-dto";
import type { Shift } from "../types/models/shift/shift";
import type { BaseService } from "./interface/base-service";

export class ShiftService implements BaseService<Shift> {
  /**
   * Lấy danh sách ca làm việc có phân trang
   * @param params
   * @returns {Promise<Response<Shift>>}
   */
  async getAllPagination(params: Object): Promise<Response<Shift>> {
    return await shiftApi.get("/all-pagination", params);
  }

  /**
   * Lấy danh sách ca làm việc có phân trang và lọc
   * @param params
   * @returns {Promise<Response<Shift>>}
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
   * @param item
   * @returns {Promise<Response<Shift>>}
   */
  async create(item: Shift): Promise<Response<Shift>> {
    return await shiftApi.post(`/save-shift`, item);
  }
  /**
   * Cập nhật ca làm việc
   * @param id
   * @param item
   * @returns {Promise<Response<Shift>>}
   */
  async update(id: string, item: Shift): Promise<Response<Shift>> {
    return await shiftApi.put(`update/${id}`, item);
  }
  /**
   * Cập nhật trạng thái hoạt động ca làm việc
   * @param ids
   * @returns {Promise<Response<Shift>>}
   */
  async updateStatusActive(ids: Set<string>): Promise<Response<Shift>> {
    return await shiftApi.updateStatus("/update-status-active", ids);
  }
  /**
   * Cập nhật trạng thái không hoạt động ca làm việc
   * @param ids
   * @returns {Promise<Response<Shift>>}
   */
  async updateStatusInactive(ids: Set<string>): Promise<Response<Shift>> {
    return await shiftApi.updateStatus("/update-status-inactive", ids);
  }
  /**
   * Xoá nhiều ca làm việc
   * @param ids
   * @returns {Promise<void>}
   */
  async delete(ids: Set<string>): Promise<Response<null>> {
    return await shiftApi.deleteMultiple("/delete", ids);
  }
}

export const shiftService = new ShiftService();
