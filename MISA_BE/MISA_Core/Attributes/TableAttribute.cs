/// <summary>
/// TableAttribute - Custom Attribute đánh dấu tên bảng trong database cho Entity class
/// Sử dụng trong BaseRepo để tự động xây dựng câu lệnh SQL
/// Áp dụng cho class level
/// Ví dụ: [TableAttribute("shift")] -> bảng "shift" trong database
/// Created By: hanv - 20/01/2026
/// </summary>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class TableAttribute : Attribute
    {
        public string TableName { get; set; }

        public TableAttribute(string tableName)
        {
            TableName = tableName;
        }
    }
}
