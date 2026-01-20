/// <summary>
/// Shift Entity - Biểu diễn thông tin Ca làm việc trong hệ thống
/// Chứa thông tin về:
/// - Thông tin cơ bản: Mã, Tên, Mô tả
/// - Thời gian: Giờ vào ca, Giờ ra ca, Giờ bắt đầu/kết thúc nghỉ giữa ca
/// - Tính toán: Tổng thời gian làm việc, Tổng thời gian nghỉ
/// - Trạng thái: Active/Inactive
/// - Audit: CreatedBy, CreatedDate, ModifiedBy, ModifiedDate
/// Sử dụng TableAttribute và ColumnAttribute để map với database
/// Created By: hanv - 20/01/2026
/// </summary>
using MISA_Core.Attributes;
using MISA_Core.Entities.Base;
using TableAttribute = MISA_Core.Attributes.TableAttribute;

namespace MISA_Core.Entities
{
    [TableAttribute("shift")]
    public class Shift : IAuditable
    {
        [ColumnAttribute("shift_id")]
        public Guid ShiftId { get; set; }
        [ColumnAttribute("shift_code")]
        public string ShiftCode { get; set; }
        [ColumnAttribute("shift_name")]
        public string ShiftName { get; set; }
        [ColumnAttribute("shift_description")]
        public string ShiftDescription { get; set; }
        [ColumnAttribute("shift_begin_time")]
        public TimeSpan? ShiftBeginTime { get; set; }
        [ColumnAttribute("shift_end_time")]
        public TimeSpan? ShiftEndTime { get; set; }
        [ColumnAttribute("shift_begin_break_time")]
        public TimeSpan? ShiftBeginBreakTime { get; set; }
        [ColumnAttribute("shift_end_break_time")]
        public TimeSpan? ShiftEndBreakTime { get; set; }
        [ColumnAttribute("shift_working_time")]
        public float ShiftWorkingTime { get; set; }
        [ColumnAttribute("shift_breaking_time")]
        public float ShiftBreakingTime { get; set; }
        [ColumnAttribute("shift_status")]
        public int ShiftStatus { get; set; }
        [ColumnAttribute("created_by")]
        public string CreatedBy { get; set; }
        [ColumnAttribute("created_date")]
        public DateTime CreatedDate { get; set; }
        [ColumnAttribute("modified_by")]
        public string? ModifiedBy { get; set; } = null;
        [ColumnAttribute("modified_date")]
        public DateTime? ModifiedDate { get; set; } = null;
    }
}
