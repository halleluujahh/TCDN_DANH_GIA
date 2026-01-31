/**
 * Định dạng chuỗi thời gian tự do thành HH:MM (có thể rỗng nếu chưa đủ ký tự).
 * @param {string} value - Chuỗi nhập vào.
 * @returns {string} Chuỗi HH:MM sau khi chuẩn hóa.
 */
export const formatTime = (value: string | number): string => {
  if (!value) return "";

  const str = String(value);

  // chỉ lấy số
  let digits = str.replace(/\D/g, "").slice(0, 4);

  let hour = digits.slice(0, 2);
  let minute = digits.slice(2, 4);

  // validate hour
  if (hour.length === 2) {
    const h = Number(hour);
    if (h > 23) hour = "23";
  }

  // validate minute
  if (minute.length === 2) {
    const m = Number(minute);
    if (m > 59) minute = "59";
  }

  return minute ? `${hour}:${minute}` : hour;
};
/**
 * Chuẩn hóa thời gian thành HH:MM luôn hợp lệ, tự padding và giới hạn 23:59.
 * @param {string|number} value - Giá trị thời gian nhập vào.
 * @returns {string} Chuỗi HH:MM hợp lệ.
 */
export const formatTimeAlwaysValid = (value: string | number): string => {
  if (value === null || value === undefined || value === "") return "";

  const str = String(value);

  // chỉ lấy số, tối đa 4 ký tự
  let digits = str.replace(/\D/g, "").slice(0, 4);

  let hour = digits.slice(0, 2);
  let minute = digits.slice(2, 4);

  // padding nếu thiếu
  if (hour.length === 1) hour = "0" + hour;
  if (hour.length === 0) hour = "00";

  if (minute.length === 1) minute = minute + "0";
  if (minute.length === 0) minute = "00";

  // validate
  const h = Math.min(Number(hour), 23);
  const m = Math.min(Number(minute), 59);

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
