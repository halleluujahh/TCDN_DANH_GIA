/// <summary>
/// BaseController - Controller cơ sở cho tất cả API Controllers
/// Cung cấp các phương thức xử lý chung:
/// - Xử lý kết quả trả về từ Service Layer
/// - Tự động gán TraceId cho response
/// - Xử lý HTTP Status Code phù hợp (200, 201, 400...)
/// Định nghĩa route pattern chung: api/v1/[controller]
/// Created By: hanv - 20/01/2026
/// </summary>
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA_Core.Dtos.Response;
using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MISA_Api.Controller.Base
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public abstract class BaseController : ControllerBase
    {
        /// <summary>
        /// Xử lý kết quả trả về từ Service Layer
        /// Tự động ánh xạ OperationResult sang IActionResult với HTTP Status Code phù hợp
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu của entity</typeparam>
        /// <param name="result">Kết quả thao tác từ Service</param>
        /// <returns>IActionResult với status code tương ứng (200 OK, 201 Created, 400 Bad Request)</returns>
        protected IActionResult HandleResult<T>(OperationResult<T> result)
        {
            result.TraceId = HttpContext.TraceIdentifier;
            if(!result.IsSuccess) return BadRequest(result);
            if (result.IsCreated) return StatusCode(201, result);
            return Ok(result);
        }
    }
}
