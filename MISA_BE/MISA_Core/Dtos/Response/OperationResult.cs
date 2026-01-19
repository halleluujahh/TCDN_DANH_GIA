using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Dtos.Response
{
    public class OperationResult<T>
    {
        public int StatusCode { get; set; }
        public T? Data { get; set; }
        public IEnumerable<T>? ListData { get; set; }
        public bool IsSuccess { get; set; }
        public bool IsCreated { get; set; } = false;
        public IDictionary<string, string>? Errors { get; set; }
        public string? TraceId { get; set; }
        public string? Message { get; set; }
        public DateTime? TimeStamp { get; set; } = DateTime.Now;
        public int TotalItem { get; set; } = 0;
    }
}
