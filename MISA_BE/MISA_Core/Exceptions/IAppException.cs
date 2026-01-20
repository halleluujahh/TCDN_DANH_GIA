/// <summary>
/// IAppException - Interface cho các custom exception trong ứng dụng
/// Định nghĩa cấu trúc chuẩn cho exception:
/// - StatusCode: Mã HTTP status code (400, 404, 500...)
/// - Errors: Dictionary chứa chi tiết lỗi (FieldName -> ErrorMessage)
/// GlobalExceptionMiddleware sử dụng interface này để xử lý exception thống nhất
/// Implement bởi: BadRequestException, NotFoundException
/// Created By: hanv - 20/01/2026
/// </summary>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Exceptions
{
    public interface IAppException
    {
        int StatusCode { get; }
        IDictionary<string, string>? Errors { get; }
    }
}
