/// <summary>
/// NotFoundException - Custom exception cho các lỗi Not Found (404)
/// Sử dụng khi:
/// - Không tìm thấy entity theo ID
/// - Không tìm thấy dữ liệu theo điều kiện
/// - Resource không tồn tại trong hệ thống
/// Implement IAppException để GlobalExceptionMiddleware xử lý tự động
/// Trả về HTTP 404 với thông tin lỗi chi tiết
/// Created By: hanv - 20/01/2026
/// </summary>
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Exceptions
{
    public class NotFoundException : Exception, IAppException
    {
        public IDictionary<string, string>? Errors { get; }
        public int StatusCode => StatusCodes.Status404NotFound;

        public NotFoundException(IDictionary<string, string>? errors, string message) : base(message)
        {
            Errors = errors;
        }
    }
}
