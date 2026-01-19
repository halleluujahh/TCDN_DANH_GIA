import axios from 'axios';
import qs from 'qs';
import { API_CONFIG } from '../commons/constants';

/**
 * Tạo axios instance với cấu hình mặc định
 */
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  // Serialize array params để .NET Model Binding nhận đúng
  // Format: ShiftIds=id1&ShiftIds=id2 (không có dấu [])
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
});


/**
 * Response Interceptor
 * Xử lý response trước khi trả về cho caller
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response trong môi trường development
    console.log('Response:', response.config.url, response.data);

    // Trả về data trực tiếp thay vì toàn bộ response
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Xử lý các lỗi khác
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    
    console.error('Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });

    // Trả về lỗi với format chuẩn
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

export default axiosInstance
