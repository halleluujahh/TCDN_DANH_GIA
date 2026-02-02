/**
 * Validation utilities - Các hàm kiểm tra dữ liệu chung
 * Author: MISA Team
 * Created: 2026-01-20
 */
export const useValidation = () => {
  /**
   * Kiểm tra giá trị có rỗng không
   * @param {*} value - Giá trị cần kiểm tra
   * @returns {boolean} true nếu rỗng, false nếu có giá trị
   * Created By hanv 02/02/2026
   */
  const isEmpty = (value: any) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (typeof value === "number" && isNaN(value)) return true;
    return false;
  };

  /**
   * Kiểm tra hai giá trị có bằng nhau không
   * @param {*} value1 - Giá trị thứ nhất
   * @param {*} value2 - Giá trị thứ hai
   * @returns {boolean} true nếu bằng nhau
   * Created By hanv 02/02/2026
   */
  const isEqual = (value1: any, value2: any) => {
    return value1 === value2;
  };

  /**
   * Kiểm tra thời gian có nằm trong khoảng hợp lệ không
   * @param {string} time - Thời gian cần kiểm tra (HH:MM)
   * @param {string} startTime - Thời gian bắt đầu (HH:MM)
   * @param {string} endTime - Thời gian kết thúc (HH:MM)
   * @returns {boolean} true nếu nằm trong khoảng
   * Created By hanv 02/02/2026
   */
  const isTimeInRange = (time: string, startTime: string, endTime: string) => {
    if (!time || !startTime || !endTime) return false;

    // Chuyển đổi thời gian sang phút để so sánh
    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(":").map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const timeMinutes = timeToMinutes(time);
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Xử lý trường hợp ca qua ngày (endTime < startTime)
    if (endMinutes < startMinutes) {
      // Ca qua ngày: time phải >= start HOẶC time <= end
      return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
    }

    // Ca không qua ngày: start <= time <= end
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  };

  /**
   * Kiểm tra email hợp lệ
   * @param {string} email - Email cần kiểm tra
   * @returns {boolean} true nếu email hợp lệ
   * Created By hanv 02/02/2026
   */
  const isValidEmail = (email: string) => {
    if (isEmpty(email)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Kiểm tra số điện thoại hợp lệ (Việt Nam)
   * @param {string} phone - Số điện thoại cần kiểm tra
   * @returns {boolean} true nếu số điện thoại hợp lệ
   * Created By hanv 02/02/2026
   */
  const isValidPhone = (phone: string) => {
    if (isEmpty(phone)) return false;
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    return phoneRegex.test(phone);
  };

  /**
   * Kiểm tra độ dài chuỗi
   * @param {string} value - Chuỗi cần kiểm tra
   * @param {number} minLength - Độ dài tối thiểu
   * @param {number} maxLength - Độ dài tối đa
   * @returns {boolean} true nếu độ dài hợp lệ
   * Created By hanv 02/02/2026
   */
  const isValidLength = (
    value: string,
    minLength = 0,
    maxLength = Infinity,
  ) => {
    if (isEmpty(value)) return minLength === 0;
    const length = String(value).trim().length;
    return length >= minLength && length <= maxLength;
  };

  /**
   * Kiểm tra số có nằm trong khoảng không
   * @param {number} value - Số cần kiểm tra
   * @param {number} min - Giá trị tối thiểu
   * @param {number} max - Giá trị tối đa
   * @returns {boolean} true nếu nằm trong khoảng
   * Created By hanv 02/02/2026
   */
  const isInRange = (value: number, min: number, max: number) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
  };

  /**
   * Tạo thông báo lỗi cho trường bắt buộc
   * @param {string} fieldName - Tên trường
   * @returns {string} Thông báo lỗi
   * Created By hanv 02/02/2026
   */
  const getRequiredMessage = (fieldName: string) => {
    return `${fieldName} không được để trống.`;
  };

  /**
   * Tạo thông báo lỗi cho trường không hợp lệ
   * @param {string} fieldName - Tên trường
   * @param {string} reason - Lý do không hợp lệ
   * @returns {string} Thông báo lỗi
   * Created By hanv 02/02/2026
   */
  const getInvalidMessage = (fieldName: string, reason = "không hợp lệ") => {
    return `${fieldName} ${reason}.`;
  };
  return {
    isEmpty,
    isEqual,
    isTimeInRange,
    isValidEmail,
    isValidPhone,
    isValidLength,
    isInRange,
    getRequiredMessage,
    getInvalidMessage,
  };
};
