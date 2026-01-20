/// <summary>
/// ShiftController - API Controller quản lý Ca làm việc
/// Cung cấp các endpoints RESTful API cho CRUD operations:
/// - GET: Lấy danh sách ca làm việc (tất cả, phân trang, lọc)
/// - POST: Tạo mới ca làm việc
/// - PUT: Cập nhật thông tin ca, thay đổi trạng thái (Active/Inactive)
/// - DELETE: Xóa ca làm việc theo danh sách ID
/// Hỗ trợ tìm kiếm, lọc theo nhiều tiêu chí, sắp xếp, phân trang
/// Created By: hanv - 20/01/2026
/// </summary>
using Dapper;
using Microsoft.AspNetCore.Mvc;
using MISA_Api.Controller.Base;
using MISA_Core.Dtos;
using MISA_Core.Dtos.Request;
using MISA_Core.Entities;
using MISA_Core.Interface.Service;
using MySqlConnector;
using System.Net;
using System.Text.Json;
namespace MISA_Api.Controller
{
    [ApiController]
    public class ShiftController : BaseController
    {
        private readonly ILogger<ShiftController> _logger;
        private IShiftsService _shiftsService;

        /// <summary>
        /// Constructor - Khởi tạo ShiftController
        /// </summary>
        /// <param name="logger">Logger để ghi log</param>
        /// <param name="shiftsService">Service xử lý nghiệp vụ ca làm việc</param>
        public ShiftController(ILogger<ShiftController> logger, IShiftsService shiftsService)
        {
            _logger = logger;
            _shiftsService = shiftsService;
        }
        
        /// <summary>
        /// Lấy danh sách tất cả ca làm việc (không phân trang)
        /// </summary>
        /// <returns>Danh sách tất cả ca làm việc trong hệ thống</returns>
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Shift>>> Get()
        {
            var result = await _shiftsService.GetAll();
            return Ok(result);
        }
        
        /// <summary>
        /// Lấy danh sách ca làm việc có phân trang
        /// </summary>
        /// <param name="pageSize">Số lượng bản ghi trên mỗi trang (mặc định: 10)</param>
        /// <param name="currentPage">Trang hiện tại (mặc định: 0)</param>
        /// <returns>Danh sách ca làm việc được phân trang kèm tổng số bản ghi</returns>
        [HttpGet("all-pagination")]
        public async Task<ActionResult> GetAllPagination([FromQuery] int pageSize = 10, [FromQuery] int currentPage = 0)
        {
            var result = await _shiftsService.GetPagination(pageSize, currentPage);
            return Ok(result);
        }
        
        /// <summary>
        /// Lấy danh sách ca làm việc có phân trang và lọc nâng cao
        /// Hỗ trợ: Tìm kiếm theo từ khóa, lọc theo nhiều cột, sắp xếp
        /// </summary>
        /// <param name="shiftFilter">Bộ lọc (từ khóa tìm kiếm, danh sách điều kiện lọc)</param>
        /// <param name="pageSize">Số lượng bản ghi trên mỗi trang (mặc định: 10)</param>
        /// <param name="currentPage">Trang hiện tại (mặc định: 0)</param>
        /// <returns>Danh sách ca làm việc được lọc và phân trang</returns>
        [HttpPost("all-pagination-filter")]
        public async Task<ActionResult> GetAllPaginationFilter([FromBody] ShiftFilter shiftFilter, [FromQuery] int pageSize = 10, [FromQuery] int currentPage = 0)
        {
            var result = await _shiftsService.GetPaginationFilter(pageSize, currentPage, shiftFilter);
            return Ok(result);
        }
        
        /// <summary>
        /// Tạo mới ca làm việc
        /// Validate dữ liệu: Mã ca không trùng, các trường bắt buộc, định dạng thời gian
        /// Tự động tính toán thời gian làm việc và thời gian nghỉ
        /// </summary>
        /// <param name="shiftAddUpdateDtoRequests">Thông tin ca làm việc cần tạo mới</param>
        /// <returns>Kết quả thao tác tạo mới (Created 201 nếu thành công)</returns>
        [HttpPost("save-shift")]
        public async Task<IActionResult> CreateShift([FromBody] ShiftAddDtoRequest shiftAddUpdateDtoRequests)
        {
            var result = await _shiftsService.SaveShift(shiftAddUpdateDtoRequests);
            return HandleResult(result);
        }
        
        /// <summary>
        /// Cập nhật thông tin ca làm việc theo ID
        /// Validate: Mã ca không trùng với ca khác, ca phải tồn tại
        /// </summary>
        /// <param name="id">ID của ca làm việc cần cập nhật</param>
        /// <param name="shiftUpdateDtoRequest">Thông tin ca làm việc mới</param>
        /// <returns>Kết quả thao tác cập nhật</returns>
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateShift(Guid id, [FromBody] ShiftUpdateDtoRequest shiftUpdateDtoRequest)
        {
            var result = await _shiftsService.Update(id, shiftUpdateDtoRequest);
            return HandleResult(result);
        }
        
        /// <summary>
        /// Cập nhật trạng thái ca làm việc thành Active (Đang sử dụng)
        /// Hỗ trợ cập nhật nhiều ca cùng lúc
        /// </summary>
        /// <param name="ids">Danh sách ID các ca cần kích hoạt</param>
        /// <returns>Kết quả thao tác cập nhật trạng thái</returns>
        [HttpPut("update-status-active")]
        public async Task<IActionResult> UpdateShiftStatusToActive([FromForm] List<Guid> ids)
        {
            var result = await _shiftsService.UpdateShiftStatusToActiveById(ids);
            return HandleResult(result);
        }
        
        /// <summary>
        /// Cập nhật trạng thái ca làm việc thành Inactive (Ngừng sử dụng)
        /// Hỗ trợ cập nhật nhiều ca cùng lúc
        /// </summary>
        /// <param name="ids">Danh sách ID các ca cần ngừng sử dụng</param>
        /// <returns>Kết quả thao tác cập nhật trạng thái</returns>
        [HttpPut("update-status-inactive")]
        public async Task<IActionResult> UpdateShiftStatusToInactive([FromForm] List<Guid> ids)
        {
            var result = await _shiftsService.UpdateShiftStatusToInactiveById(ids);
            return HandleResult(result);
        }
        
        /// <summary>
        /// Xóa ca làm việc theo danh sách ID
        /// Hỗ trợ xóa nhiều ca cùng lúc
        /// </summary>
        /// <param name="ids">Danh sách ID các ca cần xóa</param>
        /// <returns>Kết quả thao tác xóa</returns>
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteByIds([FromForm] List<Guid> ids)
        {
            var result = await _shiftsService.DeleteByIds(ids);
            return HandleResult(result);
        }
    }
}
