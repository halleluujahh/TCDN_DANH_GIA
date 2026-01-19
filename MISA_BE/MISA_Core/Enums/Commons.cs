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
