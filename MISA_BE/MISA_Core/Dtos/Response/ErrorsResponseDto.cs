using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Dtos.Response
{
    public class ErrorsResponseDto
    {
        public string Message {  get; set; }
        public IDictionary<string, string>? Errors { get; set; }
        public int StatusCode { get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.Now;
        public string TraceId { get; set; }
    }
}
