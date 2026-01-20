import axiosInstance from './axiosConfig'

/**
 * BaseApiService - Base service class cho tất cả API calls
 * Cung cấp các phương thức CRUD chuẩn (GET, POST, PUT, DELETE)
 * Tự động thêm endpoint vào tất cả requests
 * Created By hanv 20/01/2026
 */
class BaseApiService {
  /**
   * Constructor khởi tạo BaseApiService với endpoint cụ thể
   * @param {string} endpoint - Đường dẫn API endpoint (vd: '/api/shifts')
   * Created By hanv 20/01/2026
   */
  constructor(endpoint) {
    this.endpoint = endpoint
    this.axios = axiosInstance
  }

  /**
   * GET request để lấy dữ liệu
   * @param {string} url - URL path (sẽ được ghép với endpoint)
   * @param {Object} params - Query parameters
   * @returns {Promise} Response từ API
   * Created By hanv 20/01/2026
   */
  get(url, params = {}) {
    return this.axios.get(`${this.endpoint}${url}`, { params })
  }

  /**
   * POST request để tạo mới resource
   * @param {Object} data - Dữ liệu gửi đi
   * @returns {Promise} Response từ API với data mới tạo
   * Created By hanv 20/01/2026
   */
  create(data) {
    return this.axios.post(this.endpoint, data)
  }

  /**
   * PUT request để cập nhật resource theo ID
   * @param {number|string} id - ID của resource cần cập nhật
   * @param {Object} data - Dữ liệu cập nhật
   * @returns {Promise} Response từ API
   * Created By hanv 20/01/2026
   */
  update(id, data) {
    return this.axios.put(`${this.endpoint}/update/${id}`, data)
  }

  /**
   * DELETE request để xóa nhiều resources
   * @param {Array} ids - Mảng ID cần xóa
   * @returns {Promise} Response từ API
   * Created By hanv 20/01/2026
   */
  deleteMultiple(ids) {
    return this.axios.delete(this.endpoint, { data: { ids } })
  }

  /**
   * POST request tùy chỉnh với URL tùy chỉnh
   * @param {string} url - Custom URL path
   * @param {Object} data - Dữ liệu gửi đi
   * @returns {Promise} Response từ API
   * Created By hanv 20/01/2026
   */
  post(url, data) {
    return this.axios.post(`${this.endpoint}${url}`, data)
  }

  /**
   * PUT request tùy chỉnh với URL tùy chỉnh
   * @param {string} url - Custom URL path
   * @param {Object} data - Dữ liệu cập nhật
   * @returns {Promise} Response từ API
   * Created By hanv 20/01/2026
   */
  put(url, data) {
    return this.axios.put(`${this.endpoint}${url}`, data)
  }

  /**
   * DELETE request tùy chỉnh với URL tùy chỉnh
   * @param {string} url - Custom URL path
   * @param {Object} data - Dữ liệu gửi đi (nếu cần)
   * @returns {Promise} Response từ API
   * Created By hanv 20/01/2026
   */
  delete(url, data) {
    return this.axios.delete(`${this.endpoint}${url}`, data)
  }
}

export default BaseApiService; 
