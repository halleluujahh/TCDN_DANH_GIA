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
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="result"></param>
        /// <returns></returns>
        protected IActionResult HandleResult<T>(OperationResult<T> result)
        {
            result.TraceId = HttpContext.TraceIdentifier;
            if(!result.IsSuccess) return BadRequest(result);
            if (result.IsCreated) return StatusCode(201, result);
            return Ok(result);
        }
    }
}
