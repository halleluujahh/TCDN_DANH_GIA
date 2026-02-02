import { ref } from "vue";
import { useValidation } from "../common/use-validation";

export const useShiftForm = () => {
  const {
    isEmpty,
    isEqual,
    isTimeInRange,
    getRequiredMessage,
    getInvalidMessage,
  } = useValidation();

  const errors = ref<Record<string, string>>({});
  const isValid = ref<boolean>(true);

  /**
   * Chuyển chuỗi HH:MM sang tổng số phút
   * @param {string} time - Chuỗi thời gian HH:MM
   * @returns {number} Số phút tính từ 00:00
   * Created By hanv 02/02/2026
   */
  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };
  /**
   * Tính tổng số phút giữa thời gian bắt đầu và kết thúc, hỗ trợ ca qua ngày
   * @param {string} beginTime - Thời gian bắt đầu HH:MM
   * @param {string} endTime - Thời gian kết thúc HH:MM
   * @returns {number} Số phút làm việc
   * Created By hanv 02/02/2026
   */
  const calcWorkingMinutes = (beginTime: string, endTime: string) => {
    if (!beginTime || !endTime) return 0;

    const start = toMinutes(beginTime);
    const end = toMinutes(endTime);

    // ca không qua ngày
    if (end >= start) {
      return end - start;
    }

    // ca qua ngày
    return 24 * 60 - start + end;
  };
  /**
   * Tính số giờ làm việc (đã trừ thời gian nghỉ) giữa hai mốc thời gian
   * @param {string} beginTime - Thời gian bắt đầu HH:MM
   * @param {string} endTime - Thời gian kết thúc HH:MM
   * @param {string} breakingTime - Thời gian nghỉ giữa ca, dạng số với dấu phẩy hoặc chấm
   * @returns {string} Số giờ định dạng 0,00
   * Created By hanv 02/02/2026
   */
  const calcWorkingHours = (
    beginTime: string,
    endTime: string,
    breakingTime: string | null,
  ) => {
    let result;
    if (breakingTime && breakingTime !== null && breakingTime !== undefined) {
      result =
        calcWorkingMinutes(beginTime, endTime) / 60 -
        Number(breakingTime.replace(",", "."));
    } else {
      result = calcWorkingMinutes(beginTime, endTime) / 60;
    }
    if (isNaN(result) || result === null || result === undefined) {
      result = 0;
    }
    return Number(result).toFixed(2).replace(".", ",");
  };

  /**
   * Validate trường bắt buộc
   * @param {*} value - Giá trị cần kiểm tra
   * @param {string} fieldName - Tên trường
   * @param {string} fieldKey - Key của trường (để lưu error)
   * @returns {boolean} true nếu hợp lệ
   * Created By hanv 02/02/2026
   */
  const validateRequired = (
    value: any,
    fieldName: string,
    fieldKey: string,
  ) => {
    if (isEmpty(value)) {
      errors.value[fieldKey] = getRequiredMessage(fieldName);
      isValid.value = false;
      return false;
    }

    // Clear error nếu hợp lệ
    delete errors.value[fieldKey];
    return true;
  };

  /**
   * Validate hai giá trị không được bằng nhau
   * @param {*} value1 - Giá trị thứ nhất
   * @param {*} value2 - Giá trị thứ hai
   * @param {string} fieldName - Tên trường
   * @param {string} comparisonName - Tên trường so sánh
   * @param {string} fieldKey - Key của trường
   * @returns {boolean} true nếu hợp lệ
   * Created By hanv 02/02/2026
   */
  const validateNotEqual = (
    value1: any,
    value2: any,
    fieldName: string,
    comparisonName: string,
    fieldKey: string,
  ) => {
    if (!isEmpty(value1) && !isEmpty(value2) && isEqual(value1, value2)) {
      errors.value[fieldKey] = getInvalidMessage(
        fieldName,
        `không được bằng ${comparisonName}`,
      );
      isValid.value = false;
      return false;
    }

    delete errors.value[fieldKey];
    return true;
  };

  /**
   * Validate thời gian trong khoảng
   * @param {string} time - Thời gian cần kiểm tra
   * @param {string} startTime - Thời gian bắt đầu
   * @param {string} endTime - Thời gian kết thúc
   * @param {string} fieldName - Tên trường
   * @param {string} rangeName - Tên khoảng thời gian
   * @param {string} fieldKey - Key của trường
   * @returns {boolean} true nếu hợp lệ
   * Created By hanv 02/02/2026
   */
  const validateTimeInRange = (
    time: string,
    startTime: string,
    endTime: string,
    fieldName: string,
    rangeName: string,
    fieldKey: string,
  ) => {
    if (!isEmpty(time) && !isEmpty(startTime) && !isEmpty(endTime)) {
      if (!isTimeInRange(time, startTime, endTime)) {
        errors.value[fieldKey] =
          `${fieldName} phải nằm trong khoảng thời gian ${rangeName}. Vui lòng kiểm tra lại.`;
        isValid.value = false;
        return false;
      }
    }

    delete errors.value[fieldKey];
    return true;
  };

  /**
   * Validate form theo cấu hình fields
   * @param {Array} formFields - Danh sách các field cần validate
   * @param {Object} validationRules - Các rule validate tùy chỉnh
   * @returns {boolean} true nếu form hợp lệ
   * Created By hanv 02/02/2026
   */
  const validateForm = (
    formFields: any[],
    validationRules: Record<string, Function> = {},
  ) => {
    errors.value = {};
    isValid.value = true;

    formFields.forEach((field) => {
      const { value, label, field: fieldKey, isRequired, errorMessage } = field;

      // Validate required
      if (isRequired && !validateRequired(value, label, fieldKey)) {
        field.errorMessage = errors.value[fieldKey];
        return;
      }

      // Clear error nếu pass required check
      field.errorMessage = "";
    });

    // Validate các rule tùy chỉnh
    if (validationRules && typeof validationRules === "object") {
      Object.keys(validationRules).forEach((ruleKey) => {
        const rule = validationRules[ruleKey];
        if (typeof rule === "function") {
          const result = rule();
          if (!result.isValid) {
            isValid.value = false;
            // Tìm field và gán error
            const field = formFields.find((f) => f.field === ruleKey);
            if (field) {
              field.errorMessage = result.message;
              errors.value[ruleKey] = result.message;
            }
          }
        }
      });
    }

    return isValid.value;
  };

  /**
   * Validate modal có nhiều groups
   * @param {Array} modalGroups - Mảng các group trong modal
   * @param {Object} validationRules - Các rule validate nghiệp vụ
   * @returns {boolean} true nếu hợp lệ
   * Created By hanv 02/02/2026
   */
  const validateModalForm = (
    modalGroups: any[],
    validationRules: Record<string, Function> = {},
  ) => {
    errors.value = {};
    isValid.value = true;

    // Validate required cho tất cả fields
    modalGroups.forEach((group) => {
      if (group.formItems) {
        group.formItems.forEach((item: any) => {
          if (item.isRequired) {
            if (!validateRequired(item.value, item.label, item.field)) {
              item.errorMessage = errors.value[item.field];
              return;
            }
          }
          item.errorMessage = "";
        });
      }
    });

    // Validate custom rules
    if (validationRules && typeof validationRules === "object") {
      Object.keys(validationRules).forEach((ruleKey) => {
        const rule = validationRules[ruleKey];
        if (typeof rule === "function") {
          const result = rule();
          if (!result.isValid) {
            isValid.value = false;

            // Tìm field và gán error
            for (const group of modalGroups) {
              if (group.formItems) {
                const field = group.formItems.find((f) => f.field === ruleKey);
                if (field) {
                  field.errorMessage = result.message;
                  errors.value[ruleKey] = result.message;
                  break;
                }
              }
            }
          }
        }
      });
    }

    return isValid.value;
  };

  /**
   * Clear tất cả errors
   * Created By hanv 02/02/2026
   */
  const clearErrors = () => {
    errors.value = {};
    isValid.value = true;
  };

  /**
   * Clear error của một field cụ thể
   * @param {string} fieldKey - Key của field cần clear error
   * Created By hanv 02/02/2026
   */
  const clearFieldError = (fieldKey: string) => {
    delete errors.value[fieldKey];
  };
  return {
    isEmpty,
    isEqual,
    isTimeInRange,
    validateRequired,
    calcWorkingHours,
    validateForm,
    validateModalForm,
    validateNotEqual,
    validateTimeInRange,
    clearErrors,
    clearFieldError,
    errors,
    isValid,
  };
};
