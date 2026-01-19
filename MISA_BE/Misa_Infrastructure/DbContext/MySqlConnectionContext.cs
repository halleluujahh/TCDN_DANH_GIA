using Microsoft.Extensions.Configuration;
using MISA_Core.Interfaces;
using MySqlConnector;
using System.Data;

namespace MISA_Infrastructure.DbContext
{
    public class MySqlConnectionContext : IDatabaseConnection
    {
        private readonly string _connectionString;
        public MySqlConnectionContext(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MISA_AMIS_Conn") ?? throw new InvalidOperationException("Connection string 'MISA_AMIS_Conn' chưa cấu hình.");
        }

        public IDbConnection Connection()
        {
            return new MySqlConnection(_connectionString);
        }
    }
}
