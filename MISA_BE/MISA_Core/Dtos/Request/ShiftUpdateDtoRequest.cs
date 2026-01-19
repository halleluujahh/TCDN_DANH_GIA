using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Dtos.Request
{
    public class ShiftUpdateDtoRequest
    {
        public Guid ShiftId { get; set; }
        public string? ShiftCode { get; set; }
        public string? ShiftName { get; set; }
        public string? ShiftDescription { get; set; }
        public string? ShiftBeginTime { get; set; }
        public string? ShiftEndTime { get; set; }
        public string? ShiftBeginBreakTime { get; set; }
        public string? ShiftEndBreakTime { get; set; }
        public float? ShiftWorkingTime { get; set; }
        public float? ShiftBreakingTime { get; set; }
        public int ShiftStatus { get; set; }
    }
}
