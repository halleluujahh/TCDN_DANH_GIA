/// <summary>
/// ColumnAttribute - Custom Attribute đánh dấu tên cột trong database cho Entity property
/// Sử dụng trong BaseRepo để:
/// - Tự động map giữa Entity property và database column
/// - Xây dựng câu lệnh SQL động
/// Áp dụng cho property level
/// Ví dụ: [ColumnAttribute("shift_code")] -> cột "shift_code" trong database
/// Created By: hanv - 20/01/2026
/// </summary>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class ColumnAttribute : Attribute
    {
        public string ColumnName { get; set; }

        public ColumnAttribute(string columnName)
        {
            ColumnName = columnName;
        }
    }
}
