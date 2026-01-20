/**
 * Định dạng chuỗi thời gian tự do thành HH:MM (có thể rỗng nếu chưa đủ ký tự).
 * @param {string} value - Chuỗi nhập vào.
 * @returns {string} Chuỗi HH:MM sau khi chuẩn hóa.
 */
export const formatTime = (value) => {
    if (!value) return ''

    // chỉ lấy số
    let digits = value.replace(/\D/g, '').slice(0, 4)

    let hour = digits.slice(0, 2)
    let minute = digits.slice(2, 4)

    // validate hour
    if (hour.length === 2) {
        const h = Number(hour)
        if (h > 23) hour = '23'
    }

    // validate minute
    if (minute.length === 2) {
        const m = Number(minute)
        if (m > 59) minute = '59'
    }

    return minute
        ? `${hour}:${minute}`
        : hour
}
/**
 * Chuẩn hóa thời gian thành HH:MM luôn hợp lệ, tự padding và giới hạn 23:59.
 * @param {string|number} value - Giá trị thời gian nhập vào.
 * @returns {string} Chuỗi HH:MM hợp lệ.
 */
export const formatTimeAlwaysValid = (value) => {
    if (value === null || value === undefined || value === '') return ''

    const str = String(value)

    // chỉ lấy số, tối đa 4 ký tự
    let digits = str.replace(/\D/g, '').slice(0, 4)

    let hour = digits.slice(0, 2)
    let minute = digits.slice(2, 4)

    // padding nếu thiếu
    if (hour.length === 1) hour = '0' + hour
    if (hour.length === 0) hour = '00'

    if (minute.length === 1) minute = minute + '0'
    if (minute.length === 0) minute = '00'

    // validate
    const h = Math.min(Number(hour), 23)
    const m = Math.min(Number(minute), 59)

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
/**
 * Chuyển chuỗi HH:MM sang tổng số phút.
 * @param {string} time - Chuỗi thời gian HH:MM.
 * @returns {number} Số phút tính từ 00:00.
 */
const toMinutes = (time) => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
}
/**
 * Tính tổng số phút giữa thời gian bắt đầu và kết thúc, hỗ trợ ca qua ngày.
 * @param {string} beginTime - Thời gian bắt đầu HH:MM.
 * @param {string} endTime - Thời gian kết thúc HH:MM.
 * @returns {number} Số phút làm việc.
 */
export const calcWorkingMinutes = (beginTime, endTime) => {
    if (!beginTime || !endTime) return 0

    const start = toMinutes(beginTime)
    const end = toMinutes(endTime)

    // ca không qua ngày
    if (end >= start) {
        return end - start
    }

    // ca qua ngày
    return (24 * 60 - start) + end
}
/**
 * Tính số giờ làm việc (đã trừ thời gian nghỉ) giữa hai mốc thời gian.
 * @param {string} beginTime - Thời gian bắt đầu HH:MM.
 * @param {string} endTime - Thời gian kết thúc HH:MM.
 * @param {string} breakingTime - Thời gian nghỉ giữa ca, dạng số với dấu phẩy hoặc chấm.
 * @returns {string} Số giờ định dạng 0,00.
 */
export const calcWorkingHours = (beginTime, endTime, breakingTime) => {
    let result;
    if (breakingTime && breakingTime !== null && breakingTime !== undefined) {
        result = calcWorkingMinutes(beginTime, endTime) / 60 - Number(breakingTime.replace(',', '.'));
    } else {
        result = calcWorkingMinutes(beginTime, endTime) / 60;
    }
    if (isNaN(result) || result === null || result === undefined) {
        result = 0
    }
    return Number(result).toFixed(2).replace('.', ',');
}
/**
 * Định dạng ngày sang dd/mm/yyyy.
 * @param {string|number|Date} value - Giá trị ngày.
 * @returns {string} Chuỗi ngày dd/mm/yyyy hoặc rỗng.
 */
export const formatDate = (value) => {
    if (!value) return ''
    const date = new Date(value)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}
/**
 * Định dạng số với 2 chữ số thập phân, dùng dấu phẩy.
 * @param {string|number} value - Giá trị số.
 * @returns {string} Chuỗi số với 2 chữ số thập phân.
 */
export const formatFixed2Number = (value) => {
    if (value === null || value === undefined || value === '') {
        return '0,00'
    }

    const num = Number(String(value).replace(',', '.'))

    return num.toFixed(2).replace('.', ',')
}
/**
 * Định dạng input ngày người dùng gõ thành DD/MM/YYYY, giữ nguyên khi chưa đủ ký tự.
 * @param {string} value - Chuỗi ngày người dùng nhập.
 * @returns {string} Chuỗi sau khi thêm dấu '/'.
 */
export const formatDateInput = (value) => {
    if (!value) return ''

    // chỉ lấy số, tối đa 8 ký tự
    let digits = value.replace(/\D/g, '').slice(0, 8)

    let day = digits.slice(0, 2)
    let month = digits.slice(2, 4)
    let year = digits.slice(4, 8)

    // validate day
    if (day.length === 2) {
        const d = Number(day)
        if (d > 31) day = '31'
        if (d === 0) day = '01'
    }

    // validate month
    if (month.length === 2) {
        const m = Number(month)
        if (m > 12) month = '12'
        if (m === 0) month = '01'
    }

    // validate year
    if (year.length === 4) {
        const y = Number(year)
        if (y < 1800) year = '1800'
    }

    // format với dấu /
    if (year) {
        return `${day}/${month}/${year}`
    } else if (month) {
        return `${day}/${month}`
    } else {
        return day
    }
}
/**
 * Chuẩn hóa input ngày thành DD/MM/YYYY luôn hợp lệ, tự padding và giới hạn ngày theo tháng.
 * @param {string|number} value - Giá trị ngày nhập.
 * @returns {string} Chuỗi ngày hợp lệ DD/MM/YYYY.
 */
export const formatDateInputAlwaysValid = (value) => {
    if (value === null || value === undefined || value === '') return ''

    const str = String(value)

    // chỉ lấy số, tối đa 8 ký tự
    let digits = str.replace(/\D/g, '').slice(0, 8)

    let day = digits.slice(0, 2)
    let month = digits.slice(2, 4)
    let year = digits.slice(4, 8)

    // padding và validate day
    if (day.length === 1) day = '0' + day
    if (day.length === 0) day = '01'
    const d = Math.min(Math.max(Number(day), 1), 31)

    // padding và validate month
    if (month.length === 1) month = '0' + month
    if (month.length === 0) month = '01'
    const m = Math.min(Math.max(Number(month), 1), 12)

    // padding year
    if (year.length === 0) {
        year = new Date().getFullYear().toString()
    } else if (year.length < 4) {
        const currentYear = new Date().getFullYear().toString()
        year = currentYear.slice(0, 4 - year.length) + year
    }

    // validate năm >= 1800
    const y = Number(year)
    if (y < 1800) year = '1800'

    // validate ngày hợp lệ theo tháng
    const daysInMonth = new Date(Number(year), m, 0).getDate()
    const validDay = Math.min(d, daysInMonth)

    return `${String(validDay).padStart(2, '0')}/${String(m).padStart(2, '0')}/${year}`
}