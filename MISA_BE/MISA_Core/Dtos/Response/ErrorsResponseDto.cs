/// <summary>
/// ErrorsResponseDto - DTO chuẩn cho response lỗi từ API
/// Sử dụng bởi GlobalExceptionMiddleware để trả về khi có exception:
/// - Message: Thông báo lỗi tổng quan
/// - Errors: Dictionary chứa chi tiết lỗi (FieldName -> ErrorMessage)
/// - StatusCode: Mã lỗi HTTP (400, 404, 500...)
/// - TimeStamp: Thời điểm xảy ra lỗi
/// - TraceId: ID theo dõi request để debug
/// Giúp client xử lý lỗi một cách chuẩn hóa và hiển thị thông báo thân thiện
/// Created By: hanv - 20/01/2026
/// </summary>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Dtos.Response
{
    public class ErrorsResponseDto
    {
        public string Message {  get; set; }
        public IDictionary<string, string>? Errors { get; set; }
        public int StatusCode { get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.Now;
        public string TraceId { get; set; }
    }
}
