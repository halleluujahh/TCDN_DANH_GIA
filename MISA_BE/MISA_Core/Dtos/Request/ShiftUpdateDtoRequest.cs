/// <summary>
/// ShiftUpdateDtoRequest - DTO cho yêu cầu cập nhật Ca làm việc
/// Chứa đầy đủ thông tin của ca bao gồm:
/// - ShiftId: ID của ca cần cập nhật
/// - Thông tin cơ bản: Mã, Tên, Mô tả
/// - Thời gian: Giờ vào/ra, Giờ nghỉ
/// - Tính toán: Thời gian làm việc, Thời gian nghỉ
/// - ShiftStatus: Trạng thái ca (0: Inactive, 1: Active)
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
    public class ShiftUpdateDtoRequest
    {
        public Guid ShiftId { get; set; }
        public string? ShiftCode { get; set; }
        public string? ShiftName { get; set; }
        public string? ShiftDescription { get; set; }
        public string? ShiftBeginTime { get; set; }
        public string? ShiftEndTime { get; set; }
        public string? ShiftBeginBreakTime { get; set; }
        public string? ShiftEndBreakTime { get; set; }
        public float? ShiftWorkingTime { get; set; }
        public float? ShiftBreakingTime { get; set; }
        public int ShiftStatus { get; set; }
    }
}
