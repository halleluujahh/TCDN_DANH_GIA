let toastContainer = null;

/**
 * Gán tham chiếu container toast toàn cục.
 * @param {{ addToast: Function } | null} container - Component cung cấp phương thức addToast.
 */
export function setToastContainer(container) {
  toastContainer = container;
}

/**
 * Cung cấp các hàm tiện ích để hiển thị toast từ bất kỳ component nào.
 * @returns {{showToast: Function, success: Function, error: Function, warning: Function, info: Function}}
 */
export function useToast() {
  /**
   * Hiển thị toast với cấu hình tùy chọn.
   * @param {string} message - Nội dung thông báo.
   * @param {{type?: 'success'|'error'|'warning'|'info', duration?: number, position?: string}} [options] - Cấu hình toast.
   */
  function showToast(message, options = {}) {
    if (!toastContainer) {
      console.warn("Toast container not initialized");
      return;
    }

    toastContainer.addToast({
      message,
      type: options.type || "success",
      duration: options.duration || 3000,
      position: options.position || "top",
    });
  }

  /**
   * Hiển thị toast thành công.
   * @param {string} message - Nội dung thông báo.
   * @param {Object} [options] - Cấu hình bổ sung.
   */
  function success(message, options = {}) {
    showToast(message, { ...options, type: "success" });
  }

  /**
   * Hiển thị toast lỗi.
   * @param {string} message - Nội dung thông báo.
   * @param {Object} [options] - Cấu hình bổ sung.
   */
  function error(message, options = {}) {
    showToast(message, { ...options, type: "error" });
  }

  /**
   * Hiển thị toast cảnh báo.
   * @param {string} message - Nội dung thông báo.
   * @param {Object} [options] - Cấu hình bổ sung.
   */
  function warning(message, options = {}) {
    showToast(message, { ...options, type: "warning" });
  }

  /**
   * Hiển thị toast thông tin.
   * @param {string} message - Nội dung thông báo.
   * @param {Object} [options] - Cấu hình bổ sung.
   */
  function info(message, options = {}) {
    showToast(message, { ...options, type: "info" });
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
  };
}
