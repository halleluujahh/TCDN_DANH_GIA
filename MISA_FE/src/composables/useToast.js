let toastContainer = null;

export function setToastContainer(container) {
  toastContainer = container;
}

export function useToast() {
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

  function success(message, options = {}) {
    showToast(message, { ...options, type: "success" });
  }

  function error(message, options = {}) {
    showToast(message, { ...options, type: "error" });
  }

  function warning(message, options = {}) {
    showToast(message, { ...options, type: "warning" });
  }

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
