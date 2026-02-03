import { defineStore } from "pinia";
import type { Shift } from "../types/models/shift/shift";
import { shiftService } from "../services/shift-service";
import type { filterDTO } from "../types/DTO/shift/filter-dto";
import { add, create, type set } from "lodash";
import type { Response } from "../types/DTO/response";

const shiftStore = defineStore("shiftStore", {
  state: () => ({
    rows: [] as Shift[],
    totalItems: 0,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    setRows(rows: Shift[]) {
      this.rows = rows;
    },
    setTotalItems(totalItems: number) {
      this.totalItems = totalItems;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setError(error: string | null) {
      this.error = error;
    },
    updateStatusRows(ids: Set<string>, isActive: boolean) {
      this.rows = this.rows.map((shift) => {
        if (ids.has(shift.shiftId)) {
          return { ...shift, shiftStatus: isActive ? 1 : 0 };
        }
        return shift;
      });
    },
    deleteRows(ids: Set<string>) {
      this.rows = this.rows.filter((shift) => !ids.has(shift.shiftId));
    },
    addRow(shift: Shift) {
      this.rows.unshift(shift);
    },
    updateRow(id: string, updatedShift: Shift) {
      this.rows = this.rows.map((shift) => {
        if (shift.shiftId === id) {
          return { ...updatedShift };
        }
        console.log(this.rows);

        return shift;
      });
    },
    /**
     * Lấy danh sách ca làm việc với phân trang
     * @param {Object} params - Tham số phân trang
     * @returns {Promise<void>} Promise không trả về giá trị
     * Created By hanv 02/02/2026
     */
    async loadShifts(params: Object): Promise<void> {
      try {
        this.setLoading(true);
        const response = await shiftService.getAllPagination(params);
        this.setRows(response.listData);
        this.setTotalItems(response.totalItem);
      } catch (error: any) {
        this.setError(error.data.errors.ErrorMessage);
      } finally {
        this.setLoading(false);
      }
    },

    /**
     * Lấy danh sách ca làm việc với phân trang và lọc
     * @param {Object} params - Tham số phân trang và filter
     * @param {number} params.pageSize - Số bản ghi trên trang
     * @param {number} params.currentPage - Trang hiện tại
     * @param {filterDTO} params.filter - Điều kiện lọc
     * @returns {Promise<void>} Promise không trả về giá trị
     * Created By hanv 02/02/2026
     */
    async loadShiftsWithFilter(params: {
      pageSize: number;
      currentPage: number;
      filter: filterDTO;
    }): Promise<void> {
      try {
        this.setLoading(true);
        const response = await shiftService.getAllPaginationFilter(params);
        this.setRows(response.listData);
        this.setTotalItems(response.totalItem);
      } catch (error: any) {
        this.setError(error.data.errors.ErrorMessage);
      } finally {
        this.setLoading(false);
      }
    },
    /**
     * Kích hoạt nhiều ca làm việc
     * @param {Set<string>} ids - Danh sách ID ca làm việc cần kích hoạt
     * @returns {Promise<void>} Promise không trả về giá trị
     * Created By hanv 02/02/2026
     */
    async activeMultipleShifts(ids: Set<string>): Promise<void> {
      try {
        this.setLoading(true);
        this.updateStatusRows(ids, true);
        await shiftService.updateStatusActive(ids);
      } catch (error: any) {
        this.setError(error.data.errors.ErrorMessage);
      } finally {
        this.setLoading(false);
      }
    },
    /**
     * Hủy kích hoạt nhiều ca làm việc
     * @param {Set<string>} ids - Danh sách ID ca làm việc cần hủy kích hoạt
     * @returns {Promise<void>} Promise không trả về giá trị
     * Created By hanv 02/02/2026
     */
    async inactiveMultipleShifts(ids: Set<string>): Promise<void> {
      try {
        this.setLoading(true);
        this.updateStatusRows(ids, false);
        await shiftService.updateStatusInactive(ids);
      } catch (error: any) {
        this.setError(error.data.errors.ErrorMessage);
      } finally {
        this.setLoading(false);
      }
    },
    /**
     * Xoá nhiều ca làm việc
     * @param {Set<string>} ids - Danh sách ID ca làm việc cần xóa
     * @returns {Promise<void>} Promise không trả về giá trị
     * Created By hanv 02/02/2026
     */
    async deleteMultipleShifts(ids: Set<string>): Promise<void> {
      try {
        this.setLoading(true);
        this.deleteRows(ids);
        await shiftService.delete(ids);
      } catch (error: any) {
        this.setError(error.data.errors.ErrorMessage);
      } finally {
        this.setLoading(false);
      }
    },
    /**
     * Thêm mới ca làm việc
     * @param {Shift} shift - Thông tin ca làm việc cần thêm
     * @returns {Promise<void>} Promise không trả về giá trị
     * Created By hanv 02/02/2026
     */
    async createShift(shift: Shift): Promise<void> {
      try {
        this.setLoading(true);
        const createdShift = await shiftService.create(shift);
        this.addRow(createdShift.data as Shift);
      } catch (error: any) {
        this.setError(error.data.errors.ErrorMessage);
      } finally {
        this.setLoading(false);
      }
    },
    /**
     * Cập nhật ca làm việc
     * @param {string} id - ID ca làm việc cần cập nhật
     * @param {Shift} shift - Thông tin ca làm việc mới
     * @returns {Promise<Response<Shift> | undefined>} Kết quả cập nhật hoặc undefined nếu lỗi
     * Created By hanv 02/02/2026
     */
    async updateShift(
      id: string,
      shift: Shift,
    ): Promise<Response<Shift> | undefined> {
      try {
        this.setLoading(true);
        const updatedShift = await shiftService.update(id, shift);
        this.updateRow(id, updatedShift.data as Shift);
        return updatedShift;
      } catch (error: any) {
        this.setError(error.data.errors.ErrorMessage);
      } finally {
        this.setLoading(false);
      }
    },
  },
});

export default shiftStore;
