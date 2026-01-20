/// <summary>
/// Commons - Chứa các Enum chung cho toàn ứng dụng
/// Bao gồm:
/// - StatusCode: Mã HTTP status code
/// - StatusShift: Trạng thái ca làm việc (Inactive/Active)
/// - FilterColumnType: Kiểu lọc văn bản (Contains, StartWith, EndWith...)
/// - DateFilterColumnType: Kiểu lọc ngày tháng (Equal, Greater, Less...)
/// - SortType: Kiểu sắp xếp (Ascending, Descending, Default)
/// Sử dụng trong Repository, Service, Controller layers
/// Created By: hanv - 20/01/2026
/// </summary>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Enums
{
    public class Commons
    {
        public enum StatusCode
        {
            Success = 200,
            BadRequest = 500,
            Created = 201,
            Deleted = 204
        }
        public enum StatusShift
        {
            Inactive,
            Active,
        }
        public enum FilterColumnType
        {
            Different,
            Contains,
            NotContains,
            StartWith,
            EndWith
        }
        public enum DateFilterColumnType
        {
            Equal,
            Different,
            Less,
            LessOrEqual,
            Greater,
            GreaterOrEqual,
            Empty,
            NotEmpty,
        }
        public enum SortType
        {
            Descending,
            Ascending,
            Default
        }
    }
}
