import axios from "axios";

/**
 * Tạo axios instance với cấu hình mặc định
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:7284",
  timeout: Number(import.meta.env.VITE_TIMEOUT) || 30000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  // Serialize array params để .NET Model Binding nhận đúng
  // Format: ShiftIds=id1&ShiftIds=id2 (không có dấu [])
  /**
   * Serialize query params so .NET model binding receives repeated keys instead of array brackets.
   * @param {Record<string, unknown>} params - Query params object.
   * @returns {string} Query string formatted for repeated keys.
   */
  paramsSerializer: (params: Record<string, unknown>): string => {
    return new URLSearchParams(params as any).toString();
  },
});

/**
 * Response Interceptor
 * Xử lý response trước khi trả về cho caller
 */
axiosInstance.interceptors.response.use(
  /**
   * Handle successful responses by returning only the data payload.
   * @param {import('axios').AxiosResponse} response - Axios response object.
   * @returns {*} Response data payload.
   */
  (response: import('axios').AxiosResponse): any => {
    // Log response trong môi trường development
    console.log("Response:", response.config.url, response.data);

    // Trả về data trực tiếp thay vì toàn bộ response
    return response.data;
  },
  /**
   * Normalize response errors with consistent shape.
   * @param {import('axios').AxiosError} error - Axios error object.
   * @returns {Promise<never>} Rejected promise with normalized error info.
   */
  async (error: import('axios').AxiosError): Promise<never> => {
    const originalRequest = error.config;

    // Xử lý các lỗi khác
    const errorMessage =
      (error.response?.data as { message?: string })?.message || error.message || "Có lỗi xảy ra";

    console.error("Response Error:", {
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
  },
);

export default axiosInstance;
