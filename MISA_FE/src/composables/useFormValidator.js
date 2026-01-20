/**
 * Form Validator Composable - Xử lý validation form theo cấu hình
 * Author: MISA Team
 * Created: 2026-01-20
 */

import { ref } from 'vue'
import { isEmpty, isEqual, isTimeInRange, getRequiredMessage, getInvalidMessage } from '../utils/validation'

/**
 * Hook để validate form
 * @returns {Object} - Các phương thức và state để validate form
 */
export const useFormValidator = () => {
    const errors = ref({})
    const isValid = ref(true)

    /**
     * Validate trường bắt buộc
     * @param {*} value - Giá trị cần kiểm tra
     * @param {string} fieldName - Tên trường
     * @param {string} fieldKey - Key của trường (để lưu error)
     * @returns {boolean} - true nếu hợp lệ
     */
    const validateRequired = (value, fieldName, fieldKey) => {
        if (isEmpty(value)) {
            errors.value[fieldKey] = getRequiredMessage(fieldName)
            isValid.value = false
            return false
        }
        
        // Clear error nếu hợp lệ
        delete errors.value[fieldKey]
        return true
    }

    /**
     * Validate hai giá trị không được bằng nhau
     * @param {*} value1 - Giá trị thứ nhất
     * @param {*} value2 - Giá trị thứ hai
     * @param {string} fieldName - Tên trường
     * @param {string} comparisonName - Tên trường so sánh
     * @param {string} fieldKey - Key của trường
     * @returns {boolean} - true nếu hợp lệ
     */
    const validateNotEqual = (value1, value2, fieldName, comparisonName, fieldKey) => {
        if (!isEmpty(value1) && !isEmpty(value2) && isEqual(value1, value2)) {
            errors.value[fieldKey] = getInvalidMessage(
                fieldName, 
                `không được bằng ${comparisonName}`
            )
            isValid.value = false
            return false
        }
        
        delete errors.value[fieldKey]
        return true
    }

    /**
     * Validate thời gian trong khoảng
     * @param {string} time - Thời gian cần kiểm tra
     * @param {string} startTime - Thời gian bắt đầu
     * @param {string} endTime - Thời gian kết thúc
     * @param {string} fieldName - Tên trường
     * @param {string} rangeName - Tên khoảng thời gian
     * @param {string} fieldKey - Key của trường
     * @returns {boolean} - true nếu hợp lệ
     */
    const validateTimeInRange = (time, startTime, endTime, fieldName, rangeName, fieldKey) => {
        if (!isEmpty(time) && !isEmpty(startTime) && !isEmpty(endTime)) {
            if (!isTimeInRange(time, startTime, endTime)) {
                errors.value[fieldKey] = `${fieldName} phải nằm trong khoảng thời gian ${rangeName}. Vui lòng kiểm tra lại.`
                isValid.value = false
                return false
            }
        }
        
        delete errors.value[fieldKey]
        return true
    }

    /**
     * Validate form theo cấu hình fields
     * @param {Array} formFields - Danh sách các field cần validate
     * @param {Object} validationRules - Các rule validate tùy chỉnh
     * @returns {boolean} - true nếu form hợp lệ
     */
    const validateForm = (formFields, validationRules = {}) => {
        errors.value = {}
        isValid.value = true

        formFields.forEach(field => {
            const { value, label, field: fieldKey, isRequired, errorMessage } = field

            // Validate required
            if (isRequired && !validateRequired(value, label, fieldKey)) {
                field.errorMessage = errors.value[fieldKey]
                return
            }

            // Clear error nếu pass required check
            field.errorMessage = ''
        })

        // Validate các rule tùy chỉnh
        if (validationRules && typeof validationRules === 'object') {
            Object.keys(validationRules).forEach(ruleKey => {
                const rule = validationRules[ruleKey]
                if (typeof rule === 'function') {
                    const result = rule()
                    if (!result.isValid) {
                        isValid.value = false
                        // Tìm field và gán error
                        const field = formFields.find(f => f.field === ruleKey)
                        if (field) {
                            field.errorMessage = result.message
                            errors.value[ruleKey] = result.message
                        }
                    }
                }
            })
        }

        return isValid.value
    }

    /**
     * Validate modal có nhiều groups
     * @param {Array} modalGroups - Mảng các group trong modal
     * @param {Object} validationRules - Các rule validate nghiệp vụ
     * @returns {boolean} - true nếu hợp lệ
     */
    const validateModalForm = (modalGroups, validationRules = {}) => {
        errors.value = {}
        isValid.value = true

        // Validate required cho tất cả fields
        modalGroups.forEach(group => {
            if (group.formItems) {
                group.formItems.forEach(item => {
                    if (item.isRequired) {
                        if (!validateRequired(item.value, item.label, item.field)) {
                            item.errorMessage = errors.value[item.field]
                            return
                        }
                    }
                    item.errorMessage = ''
                })
            }
        })

        // Validate custom rules
        if (validationRules && typeof validationRules === 'object') {
            Object.keys(validationRules).forEach(ruleKey => {
                const rule = validationRules[ruleKey]
                if (typeof rule === 'function') {
                    const result = rule()
                    if (!result.isValid) {
                        isValid.value = false
                        
                        // Tìm field và gán error
                        for (const group of modalGroups) {
                            if (group.formItems) {
                                const field = group.formItems.find(f => f.field === ruleKey)
                                if (field) {
                                    field.errorMessage = result.message
                                    errors.value[ruleKey] = result.message
                                    break
                                }
                            }
                        }
                    }
                }
            })
        }

        return isValid.value
    }

    /**
     * Clear tất cả errors
     */
    const clearErrors = () => {
        errors.value = {}
        isValid.value = true
    }

    /**
     * Clear error của một field cụ thể
     * @param {string} fieldKey - Key của field cần clear error
     */
    const clearFieldError = (fieldKey) => {
        delete errors.value[fieldKey]
    }

    return {
        errors,
        isValid,
        validateRequired,
        validateNotEqual,
        validateTimeInRange,
        validateForm,
        validateModalForm,
        clearErrors,
        clearFieldError
    }
}
