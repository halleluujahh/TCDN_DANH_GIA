/// <summary>
/// ShiftFilter - DTO chứa các điều kiện lọc và tìm kiếm Ca làm việc
/// Cung cấp 2 cơ chế lọc:
/// 1. SearchKeyword: Tìm kiếm từ khóa trên nhiều cột
/// 2. FilterByShiftColumn: Lọc nâng cao theo từng cột với nhiều kiểu:
///    - FilterColumnType: Lọc văn bản (Contains, Different, StartWith...)
///    - DateFilterColumnType: Lọc ngày (Equal, Greater, Less...)
///    - SortType: Sắp xếp (Ascending, Descending)
/// Hỗ trợ lọc nhiều cột đồng thời, kết hợp AND
/// Created By: hanv - 20/01/2026
/// </summary>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MISA_Core.Enums.Commons;

namespace MISA_Core.Dtos.Request
{
    public class ShiftFilter
    {
        public string? SearchKeyword { get; set; }
        public IEnumerable<FilterByShiftColumn>? FilterByShiftColumn { get; set; }
    }

    /// <summary>
    /// FilterByShiftColumn - Định nghĩa điều kiện lọc cho một cột
    /// Mỗi instance biểu diễn một điều kiện lọc riêng biệt:
    /// - Name: Tên cột trong database (ví dụ: shift_code, shift_status)
    /// - Value: Giá trị cần lọc/so sánh
    /// - sortType: Kiểu sắp xếp (Ascending/Descending/Default)
    /// - filterColumnType: Kiểu lọc văn bản
    /// - dateFilterColumnType: Kiểu lọc ngày tháng
    /// </summary>
    public class FilterByShiftColumn
    {
        public string? Name { get; set; }
        public string? Value { get; set; }
        public SortType? sortType { get; set; }
        public FilterColumnType? filterColumnType { get; set; }
        public DateFilterColumnType? dateFilterColumnType { get; set; }
    }
}