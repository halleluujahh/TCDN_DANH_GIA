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

        public ShiftController(ILogger<ShiftController> logger, IShiftsService shiftsService)
        {
            _logger = logger;
            _shiftsService = shiftsService;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Shift>>> Get()
        {
            var result = await _shiftsService.GetAll();
            return Ok(result);
        }
        [HttpGet("all-pagination")]
        public async Task<ActionResult> GetAllPagination([FromQuery] int pageSize = 10, [FromQuery] int currentPage = 0)
        {
            var result = await _shiftsService.GetPagination(pageSize, currentPage);
            return Ok(result);
        }
        [HttpPost("all-pagination-filter")]
        public async Task<ActionResult> GetAllPaginationFilter([FromBody] ShiftFilter shiftFilter, [FromQuery] int pageSize = 10, [FromQuery] int currentPage = 0)
        {
            var result = await _shiftsService.GetPaginationFilter(pageSize, currentPage, shiftFilter);
            return Ok(result);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="shiftAddUpdateDtoRequests"></param>
        /// <returns></returns>
        [HttpPost("save-shift")]
        public async Task<IActionResult> CreateShift([FromBody] ShiftAddDtoRequest shiftAddUpdateDtoRequests)
        {
            var result = await _shiftsService.SaveShift(shiftAddUpdateDtoRequests);
            return HandleResult(result);
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateShift(Guid id, [FromBody] ShiftUpdateDtoRequest shiftUpdateDtoRequest)
        {
            var result = await _shiftsService.Update(id, shiftUpdateDtoRequest);
            return HandleResult(result);
        }
        [HttpPut("update-status-active")]
        public async Task<IActionResult> UpdateShiftStatusToActive([FromForm] List<Guid> ids)
        {
            var result = await _shiftsService.UpdateShiftStatusToActiveById(ids);
            return HandleResult(result);
        }
        [HttpPut("update-status-inactive")]
        public async Task<IActionResult> UpdateShiftStatusToInactive([FromForm] List<Guid> ids)
        {
            var result = await _shiftsService.UpdateShiftStatusToInactiveById(ids);
            return HandleResult(result);
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteByIds([FromForm] List<Guid> ids)
        {
            var result = await _shiftsService.DeleteByIds(ids);
            return HandleResult(result);
        }
    }
}
