/// <summary>
/// IDatabaseConnection - Interface định nghĩa kết nối database
/// Cung cấp IDbConnection để Repository thực thi câu lệnh SQL
/// Implement bởi MySqlConnectionContext trong MISA_Infrastructure layer
/// Hỗ trợ Dependency Injection và testing
/// Created By: hanv - 20/01/2026
/// </summary>
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Interfaces
{
    public interface IDatabaseConnection
    {
        IDbConnection Connection();
    }
}
