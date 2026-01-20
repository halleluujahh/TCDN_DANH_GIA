/// <summary>
/// ShiftAddDtoRequest - DTO cho yêu cầu tạo mới Ca làm việc
/// Chứa thông tin cần thiết để tạo mới một ca:
/// - Thông tin cơ bản: Mã ca, Tên ca, Mô tả
/// - Thời gian: Giờ vào, Giờ ra, Giờ bắt đầu/kết thúc nghỉ (chuỗi định dạng HH:mm)
/// - Tính toán: Thời gian làm việc, Thời gian nghỉ (float, đơn vị giờ)
/// Không chứa ShiftId (auto-generated), ShiftStatus (mặc định Active), Audit fields
/// Sử dụng FluentValidation để validate dữ liệu
/// Created By: hanv - 20/01/2026
/// </summary>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Dtos.Request
{
    public class ShiftAddDtoRequest
    {
        public string? ShiftCode { get; set; }
        public string? ShiftName { get; set; }
        public string? ShiftDescription { get; set; }
        public string? ShiftBeginTime { get; set; }
        public string? ShiftEndTime { get; set; }
        public string? ShiftBeginBreakTime { get; set; }
        public string? ShiftEndBreakTime { get; set; }
        public float? ShiftWorkingTime { get; set; }
        public float? ShiftBreakingTime { get; set; }
    }
}
