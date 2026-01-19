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
