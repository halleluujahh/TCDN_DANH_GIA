import BaseApiService from '../baseApi'

/**
 * API client cho nghiệp vụ ca làm việc.
 * Kế thừa BaseApiService để dùng các phương thức HTTP chuẩn.
 */
class ShiftApi extends BaseApiService {
    /**
     * Khởi tạo service với base path của Shift.
     */
    constructor() {
        super('/Shift')
    }

    /**
     * Lấy danh sách ca làm việc có phân trang.
     * @param {number} pageSize - Số bản ghi mỗi trang.
     * @param {number} currentPage - Trang hiện tại (0-based).
     * @returns {Promise<*>} Promise dữ liệu phân trang.
     */
    getAllPagination(pageSize, currentPage) {
        return this.get('/all-pagination', {
            pageSize,
            currentPage
        })
    }

    /**
     * Lấy danh sách ca làm việc có phân trang và bộ lọc.
     * @param {Object} data - Payload bộ lọc.
     * @param {number} [pageSize=10] - Số bản ghi mỗi trang.
     * @param {number} [currentPage=0] - Trang hiện tại (0-based).
     * @returns {Promise<*>} Promise dữ liệu phân trang đã lọc.
     */
    getAllPaginationFilter(data, pageSize = 10, currentPage = 0) {
        return this.post(
            `/all-pagination-filter?pageSize=${pageSize}&currentPage=${currentPage}`,
            data
        )
    }

    /**
     * Lưu mới ca làm việc.
     * @param {Object} data - Thông tin ca.
     * @returns {Promise<*>} Promise kết quả lưu.
     */
    saveShift(data) {
        return this.post('/save-shift', data)
    }

    /**
     * Cập nhật trạng thái Active cho danh sách ca.
     * @param {Array<string>} ids - Danh sách id ca.
     * @returns {Promise<*>} Promise kết quả cập nhật.
     */
    updateStatusActive(ids) {
        const formData = new FormData()

        ids.forEach(id => {
            formData.append('ids', id)
        })
        return this.put('/update-status-active', formData)
    }

    /**
     * Cập nhật trạng thái Inactive cho danh sách ca.
     * @param {Array<string>} ids - Danh sách id ca.
     * @returns {Promise<*>} Promise kết quả cập nhật.
     */
    updateStatusInactive(ids) {
        const formData = new FormData()

        ids.forEach(id => {
            formData.append('ids', id)
        })
        return this.put('/update-status-inactive', formData)
    }

    /**
     * Xóa danh sách ca làm việc.
     * @param {Array<string>} ids - Danh sách id ca.
     * @returns {Promise<*>} Promise kết quả xóa.
     */
    deleteShift(ids) {
        const formData = new FormData()

        ids.forEach(id => {
            formData.append('ids', id)
        })
        return this.delete('/delete', { data: formData })
    }
}

export default new ShiftApi()
