/// <summary>
/// MySqlConnectionContext - Context quản lý kết nối MySQL Database
/// Đọc connection string từ appsettings.json
/// Cung cấp IDbConnection để thực thi câu lệnh SQL qua Dapper
/// Sử dụng MySqlConnector package (hiệu suất cao hơn MySql.Data)
/// Created By: hanv - 20/01/2026
/// </summary>
using Microsoft.Extensions.Configuration;
using MISA_Core.Interfaces;
using MySqlConnector;
using System.Data;

namespace MISA_Infrastructure.DbContext
{
    public class MySqlConnectionContext : IDatabaseConnection
    {
        private readonly string _connectionString;
        
        /// <summary>
        /// Constructor - Khởi tạo MySqlConnectionContext
        /// Đọc connection string từ configuration với key "MISA_AMIS_Conn"
        /// </summary>
        /// <param name="configuration">IConfiguration để đọc appsettings</param>
        /// <exception cref="InvalidOperationException">Khi connection string chưa được cấu hình</exception>
        public MySqlConnectionContext(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MISA_AMIS_Conn") ?? throw new InvalidOperationException("Connection string 'MISA_AMIS_Conn' chưa cấu hình.");
        }

        /// <summary>
        /// Tạo mới IDbConnection đến MySQL Database
        /// Mỗi lần gọi sẽ tạo kết nối mới (disposable pattern)
        /// </summary>
        /// <returns>MySqlConnection instance</returns>
        public IDbConnection Connection()
        {
            return new MySqlConnection(_connectionString);
        }
    }
}
