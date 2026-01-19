using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MISA_Core.Dtos;
using MISA_Core.Dtos.Response;
using MISA_Core.Exceptions;
using System.Net;
using System.Text.Json;
using static MISA_Core.Enums.Commons;

namespace MISA_Api.Middleware
{
    public class GlobalExceptionMiddleware : IExceptionHandler
    {
        public readonly ILogger<GlobalExceptionMiddleware> _logger;
        public GlobalExceptionMiddleware(ILogger<GlobalExceptionMiddleware> logger)
        {
            _logger = logger;
        }
        public async ValueTask<bool> TryHandleAsync(
              HttpContext httpContext,
              Exception exception,
              CancellationToken cancellationToken)
        {
            _logger.LogError(
           exception, "An unhandled exception occurred: {Message}, traceId: {TraceId}", exception.Message, httpContext.TraceIdentifier);

            // Prefer explicit status from app exceptions; otherwise map common ones; fallback 500
            var statusCode = exception switch
            {
                IAppException appEx => appEx.StatusCode,
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                KeyNotFoundException => StatusCodes.Status404NotFound,
                _ => StatusCodes.Status500InternalServerError
            };

            var errors = exception is IAppException appEx2 ? appEx2.Errors : null;

            var errorResponse = new ErrorsResponseDto
            {
                Message = exception.Message,
                Errors = errors,
                StatusCode = statusCode,
                TraceId = httpContext.TraceIdentifier
            };

            httpContext.Response.StatusCode = errorResponse.StatusCode;
            await httpContext.Response.WriteAsJsonAsync(errorResponse, cancellationToken);

            // Return true to indicate the exception has been handled
            return true;
        }
    }
}
