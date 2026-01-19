using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MISA_Core.Enums.Commons;

namespace MISA_Core.Dtos.Request
{
    public class ShiftFilter
    {
        public string? SearchKeyword { get; set; }
        public IEnumerable<FilterByShiftColumn>? FilterByShiftColumn { get; set; }
    }

    public class FilterByShiftColumn
    {
        public string? Name { get; set; }
        public string? Value { get; set; }
        public SortType? sortType { get; set; }
        public FilterColumnType? filterColumnType { get; set; }
        public DateFilterColumnType? dateFilterColumnType { get; set; }
    }
}