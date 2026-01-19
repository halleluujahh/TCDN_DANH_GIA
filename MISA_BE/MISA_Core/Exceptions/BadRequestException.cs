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
