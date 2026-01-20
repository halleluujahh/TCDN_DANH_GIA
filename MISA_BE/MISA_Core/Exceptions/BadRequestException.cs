/// <summary>
/// BadRequestException - Custom exception cho các lỗi Bad Request (400)
/// Sử dụng khi:
/// - Dữ liệu validation thất bại (FluentValidation)
/// - Dữ liệu trùng lặp (mã ca đã tồn tại)
/// - Tham số đầu vào không hợp lệ
/// Implement IAppException để GlobalExceptionMiddleware xử lý tự động
/// Trả về HTTP 400 với thông tin lỗi chi tiết
/// Created By: hanv - 20/01/2026
/// </summary>
using Microsoft.AspNetCore.Http;
using MISA_Core.Dtos;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MISA_Core.Enums.Commons;

namespace MISA_Core.Exceptions
{
    public class BadRequestException : Exception, IAppException
    {
        public IDictionary<string, string>? Errors { get; }
        public int StatusCode => StatusCodes.Status400BadRequest;

        public BadRequestException(IDictionary<string, string>? errors, string message)
            : base(message)
        {
            Errors = errors;
        }

    }
}
