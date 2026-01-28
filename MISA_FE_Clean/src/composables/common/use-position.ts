/**
 * Tính toán vị trí hiển thị menu (sort/more/filter) dựa trên vị trí nút được click
 * @param {Event} event - Sự kiện click từ nút hành động
 * @param {number} [menuWidth=450] - Độ rộng menu để tránh tràn màn hình
 * @returns {Object} Tọa độ top/left/right dạng px
 * Created By hanv 20/01/2026
 */
export const calculatePositionMenu = (event: Event, menuWidth = 450) => {
  if (event.currentTarget === null)
    return { top: "0px", left: "0px", right: "0px" };

  // Lấy vị trí của phần tử nút hành động
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  // Các hằng số cấu hình
  const MARGIN = 8;
  const GAP = 8;
  const POPUP_HEIGHT = 140;
  // Tính vị trí top
  let top = rect.bottom + GAP;

  // Không tràn đáy
  if (top + POPUP_HEIGHT > window.innerHeight) {
    top = rect.top - POPUP_HEIGHT - GAP;
  }

  // Không tràn trên
  top = Math.max(top, MARGIN);

  // Kiểm tra tràn ngang
  const spaceOnRight = window.innerWidth - rect.right;
  const spaceOnLeft = rect.left;

  let left = "unset !important";
  let right = "unset !important";

  // Nếu không đủ chỗ bên phải, thử bên trái
  if (spaceOnLeft >= menuWidth + MARGIN) {
    right = `${window.innerWidth - rect.right}px !important`;
    left = "unset !important";
  }

  // Ưu tiên hiển thị bên phải
  else if (spaceOnRight >= menuWidth + MARGIN) {
    left = `${rect.left}px  !important`;
    right = "unset  !important";
  }

  // Nếu cả 2 bên đều không đủ, chọn bên nào rộng hơn
  else {
    if (spaceOnRight > spaceOnLeft) {
      left = `${Math.max(rect.left, MARGIN)}px  !important`;
      right = "unset  !important";
    } else {
      right = `${Math.max(window.innerWidth - rect.right, MARGIN)}px  !important`;
      left = "unset  !important";
    }
  }
  let position = "fixed !important";

  return { position, top: `${top}px !important`, right, left };
};
