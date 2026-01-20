/// <summary>
/// OperationResult - DTO chuẩn cho kết quả trả về từ Service/Repository Layer
/// Bao bọc kết quả thao tác CRUD với thông tin đầy đủ:
/// - StatusCode: Mã trạng thái HTTP (200, 201, 400...)
/// - Data: Một entity đơn lẻ
/// - ListData: Danh sách entity (cho phân trang, lọc)
/// - IsSuccess: Thành công hay thất bại
/// - IsCreated: Đánh dấu thao tác tạo mới (trả 201)
/// - Errors: Dictionary chứa lỗi validate (FieldName -> ErrorMessage)
/// - Message: Thông báo tổng quan
/// - TotalItem: Tổng số bản ghi (cho phân trang)
/// - TraceId, TimeStamp: Thông tin audit
/// Created By: hanv - 20/01/2026
/// </summary>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Dtos.Response
{
    public class OperationResult<T>
    {
        public int StatusCode { get; set; }
        public T? Data { get; set; }
        public IEnumerable<T>? ListData { get; set; }
        public bool IsSuccess { get; set; }
        public bool IsCreated { get; set; } = false;
        public IDictionary<string, string>? Errors { get; set; }
        public string? TraceId { get; set; }
        public string? Message { get; set; }
        public DateTime? TimeStamp { get; set; } = DateTime.Now;
        public int TotalItem { get; set; } = 0;
    }
}
