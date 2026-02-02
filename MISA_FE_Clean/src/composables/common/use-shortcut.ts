import { onMounted, onUnmounted } from "vue";

/**
 * Đăng ký phím tắt toàn cục cho component
 * @param {'esc'|'ctrl+s'|'ctrl+shift+s'} combo - Tổ hợp phím cần lắng nghe
 * @param {Function} handler - Hàm thực thi khi nhấn phím tắt
 * Created By hanv 02/02/2026
 */
export function useShortCut(
  combo: "esc" | "ctrl+s" | "ctrl+shift+s",
  handler: () => void,
) {
  /**
   * Xử lý sự kiện keydown và gọi handler nếu trùng tổ hợp phím
   * @param {KeyboardEvent} e - Sự kiện bàn phím
   * Created By hanv 02/02/2026
   */
  function onKeydown(e: KeyboardEvent) {
    switch (combo) {
      case "esc":
        // ESC
        if (e.key.toLowerCase() === "escape") {
          e.preventDefault();
          handler();
        }
        return;
      case "ctrl+s":
        // Ctrl + Shift + S
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === "s") {
          e.preventDefault();
          handler();
        }
        return;
      case "ctrl+shift+s":
        // Ctrl + S (phải đặt SAU ctrl+shift+s)
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") {
          e.preventDefault();
          handler();
        }
        return;
    }
  }

  onMounted(() => {
    window.addEventListener("keydown", onKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", onKeydown);
  });
}
