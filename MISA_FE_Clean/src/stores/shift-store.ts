import { defineStore } from "pinia";
import type { Shift } from "../types/models/shift/shift";
import { shiftService } from "../services/shift-service";
import type { filterDTO } from "../types/DTO/shift/filter-dto";

const shiftStore = defineStore("shiftStore", {
  state: () => ({
    rows: [] as Shift[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    setRows(rows: Shift[]) {
      this.rows = rows;
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

    /**
     * Load shifts with pagination
     * @param pageSize - number of items per page
     * @param currentPage - current page number
     * @returns {Promise<void>}
     **/
    async loadShifts(params: Object): Promise<void> {
      try {
        this.setLoading(true);
        const response = await shiftService.getAllPagination(params);
        this.setRows(response.listData);
      } catch (error: any) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    },

    /**
     * Lấy ca làm việc với phân trang và lọc
     * @param params
     * @returns {Promise<void>}
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
      } catch (error: any) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    },
    /**
     * Kích hoạt nhiều ca làm việc
     * @param ids
     */
    async activeMultipleShifts(ids: Set<string>): Promise<void> {
      try {
        this.setLoading(true);
        await shiftService.updateStatusActive(ids);
        this.updateStatusRows(ids, true);
      } catch (error: any) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    },
    /**
     * Hủy kích hoạt nhiều ca làm việc
     * @param ids
     */
    async inactiveMultipleShifts(ids: Set<string>): Promise<void> {
      try {
        this.setLoading(true);
        await shiftService.updateStatusInactive(ids);
        this.updateStatusRows(ids, false);
      } catch (error: any) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    },
    /**
     * Xoá nhiều ca làm việc
     * @param ids
     */
    async deleteMultipleShifts(ids: Set<string>): Promise<void> {
      try {
        this.setLoading(true);
        await shiftService.delete(ids);
        this.deleteRows(ids);
      } catch (error: any) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    },
  },
});

export default shiftStore;
