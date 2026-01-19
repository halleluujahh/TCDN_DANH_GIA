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
