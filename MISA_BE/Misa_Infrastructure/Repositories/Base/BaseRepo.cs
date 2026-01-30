/// <summary>
/// BaseRepo - Repository Pattern cơ sở cho tất cả các entity
/// Cung cấp các chức năng CRUD cơ bản:
/// - GetAll, GetById, GetByFieldName: Đọc dữ liệu
/// - GetPagination: Phân trang dữ liệu
/// - Save: Thêm mới
/// - Update, UpdateByFieldName: Cập nhật
/// - DeleteByIds: Xóa theo danh sách ID
/// Sử dụng Custom Attributes (TableAttribute, ColumnAttribute) để map Entity-Database
/// Sử dụng Reflection để tự động xây dựng câu lệnh SQL
/// Sử dụng Dapper để thực thi SQL và map kết quả
/// Created By: hanv - 20/01/2026
/// </summary>
using Dapper;
using MISA_Core.Attributes;
using MISA_Core.Dtos.Response;
using MISA_Core.Entities;
using MISA_Core.Enums;
using MISA_Core.Interfaces;
using MISA_Core.Interfaces.Repositories.Base;
using System.Collections.Generic;
using System.Data.Common;
using System.Reflection;

namespace MISA_Infrastructure.Repositories.Base
{
    public class BaseRepo<T> : IBaseRepo<T>
    {
        private IDatabaseConnection _databaseConnection;

        /// <summary>
        /// Lấy tên bảng từ TableAttribute của Entity
        /// </summary>
        public string _tableName => typeof(T).GetCustomAttribute<TableAttribute>()?.TableName ?? throw new Exception("Table not found.");

        /// <summary>
        /// Constructor - Khởi tạo BaseRepo
        /// </summary>
        /// <param name="connection">Database connection interface</param>
        public BaseRepo(IDatabaseConnection connection)
        {
            _databaseConnection = connection;
        }
        
        /// <summary>
        /// Lấy danh sách tên cột (column name) từ các property có ColumnAttribute
        /// </summary>
        /// <returns>Danh sách tên cột trong database</returns>
        public List<string> GetTableProperty()
        {
            var properties = typeof(T).GetProperties().Select(p => p.GetCustomAttribute<ColumnAttribute>()?.ColumnName).ToList() ?? throw new Exception("Not found properties.");
            return properties;
        }
        
        /// <summary>
        /// Lấy tất cả bản ghi từ bảng
        /// </summary>
        /// <returns>Danh sách tất cả entity</returns>
        public async Task<IEnumerable<T>> GetAll()
        {
            using (var conn = _databaseConnection.Connection())
            {
                return await conn.QueryAsync<T>($"select * from {_tableName}");
            }
        }

        /// <summary>
        /// Thêm mới một bản ghi vào bảng
        /// Tự động xây dựng câu lệnh INSERT dựa trên các property có ColumnAttribute
        /// </summary>
        /// <param name="item">Entity cần thêm mới</param>
        /// <returns>OperationResult chứa entity vừa được thêm</returns>
        public async Task<OperationResult<T>> Save(T item)
        {
            using (var conn = _databaseConnection.Connection())
            {
                List<string> properties = GetTableProperty();
                var tableId = _tableName + "_id";

                var values = new List<string>();
                var param = new DynamicParameters();
                var selectColumns = new List<string>();
                var idInserted = GetPropertyByColumnName<T>(tableId).GetValue(item);
                param.Add("idInserted", idInserted);
                foreach (var property in properties)
                {
                    var propInfo = GetPropertyByColumnName<T>(property);
                    if (propInfo == null) continue;
                    param.Add($"@{property}", propInfo.GetValue(item));
                    values.Add($"@{property}");
                    selectColumns.Add($"{property} AS {propInfo.Name}");
                }
                var sql = $@"INSERT INTO {_tableName} ({string.Join(", ", properties)}) VALUE ({string.Join(", ", values)}); 
                             SELECT {string.Join(", ", selectColumns)} FROM {_tableName} WHERE {tableId} = @idInserted;";
                using var multi = await conn.QueryMultipleAsync(sql, param);
                var insertedItem = await multi.ReadSingleAsync<T>();
                return new OperationResult<T>
                {
                    Data = insertedItem,
                    StatusCode = insertedItem != null ? (int)Commons.StatusCode.Created : (int)Commons.StatusCode.BadRequest,
                    IsCreated = insertedItem != null ? true : false,
                    IsSuccess = insertedItem != null ? true : false,
                    Message = insertedItem != null ? "" : "Đã có lỗi xảy ra"
                };
            }
        }

        /// <summary>
        /// Cập nhật một bản ghi trong bảng
        /// Tự động xây dựng câu lệnh UPDATE dựa trên các property có ColumnAttribute
        /// </summary>
        /// <param name="item">Entity cần cập nhật</param>
        /// <returns>OperationResult chứa entity đã cập nhật</returns>
        public async Task<OperationResult<T>> Update(T item)
        {
            using (var conn = _databaseConnection.Connection())
            {
                List<string> properties = GetTableProperty();
                var tableId = _tableName + "_id";
                properties.Remove(tableId);

                var sets = new List<string>();
                var param = new DynamicParameters();

                var keyValue = GetPropertyByColumnName<T>(tableId).GetValue(item);

                foreach (var property in properties)
                {
                    var propInfo = GetPropertyByColumnName<T>(property);
                    if (propInfo == null) continue;
                    param.Add($"@{property}", propInfo.GetValue(item));
                    sets.Add($"{property} = @{property}");
                }
                param.Add($"@{tableId}", keyValue);
                var sql = $@"UPDATE {_tableName} SET {string.Join(", ", sets)} WHERE {tableId} = @{tableId}";
                var affected = await conn.ExecuteAsync(sql, param);
                return new OperationResult<T>
                {
                    Data = item,
                    StatusCode = affected > 0 ? (int)Commons.StatusCode.Success : (int)Commons.StatusCode.BadRequest,
                    IsSuccess = affected > 0 ? true : false,
                    Message = affected > 0 ? "" : "Đã có lỗi xảy ra"
                };
            }
        }

        /// <summary>
        /// Lấy danh sách bản ghi có phân trang
        /// Sử dụng LIMIT và OFFSET để phân trang
        /// </summary>
        /// <param name="pageSize">Số lượng bản ghi trên mỗi trang</param>
        /// <param name="currentPage">Trang hiện tại (bắt đầu từ 0)</param>
        /// <returns>OperationResult chứa danh sách entity và tổng số bản ghi</returns>
        public async Task<OperationResult<T>> GetPagination(int pageSize, int currentPage)
        {
            using (var conn = _databaseConnection.Connection())
            {
                List<string> properties = GetTableProperty();

                var param = new DynamicParameters();
                param.Add("limit", pageSize);
                param.Add("offset", currentPage * pageSize);
                var selectColumns = new List<string>();
                foreach (var property in properties)
                {
                    var propInfo = GetPropertyByColumnName<T>(property);
                    if (propInfo == null) continue;
                    selectColumns.Add($"{property} AS {propInfo.Name}");
                }
                // Query
                var sql = $@"SELECT {string.Join(", ", selectColumns)} FROM {_tableName} LIMIT @limit OFFSET @offset;
                             SELECT COUNT(1) FROM {_tableName};";


                using var multi = await conn.QueryMultipleAsync(sql, param);
                var items = await multi.ReadAsync<T>();
                var totalItem = await multi.ReadSingleAsync<int>();

                return new OperationResult<T>
                {
                    ListData = items,
                    StatusCode = (int)Commons.StatusCode.Success,
                    IsSuccess = true,
                    TotalItem = totalItem
                };
            }
        }

        /// <summary>
        /// Lấy PropertyInfo từ tên cột trong database
        /// Sử dụng Reflection để tìm property có ColumnAttribute khớp với columnName
        /// </summary>
        /// <typeparam name="T">Kiểu Entity</typeparam>
        /// <param name="columnName">Tên cột trong database</param>
        /// <returns>PropertyInfo nếu tìm thấy, null nếu không</returns>
        public static PropertyInfo? GetPropertyByColumnName<T>(string columnName)
        {
            return typeof(T)
                .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .FirstOrDefault(p =>
                    p.GetCustomAttribute<ColumnAttribute>()?.ColumnName
                        .Equals(columnName, StringComparison.OrdinalIgnoreCase) == true
                );
        }

        /// <summary>
        /// Lấy một bản ghi theo ID
        /// </summary>
        /// <param name="id">ID của bản ghi</param>
        /// <returns>Entity nếu tìm thấy, null nếu không</returns>
        public async Task<T> GetById(Guid id)
        {
            using (var conn = _databaseConnection.Connection())
            {
                List<string> properties = GetTableProperty();
                var tableId = _tableName + "_id";
                var param = new DynamicParameters();
                param.Add("id", id);
                var selectColumns = new List<string>();

                foreach (var property in properties)
                {
                    var propInfo = GetPropertyByColumnName<T>(property);
                    if (propInfo == null) continue;
                    selectColumns.Add($"{property} AS {propInfo.Name}");
                }
                var sql = $@"SELECT {string.Join(", ", selectColumns)} FROM {_tableName} WHERE {tableId} = @id";
                var item = await conn.QueryFirstOrDefaultAsync<T>(sql, param);

                return item;
            }
        }

        /// <summary>
        /// Lấy một bản ghi theo giá trị của một trường bất kỳ
        /// </summary>
        /// <param name="value">Giá trị cần tìm</param>
        /// <param name="fieldName">Tên cột trong database</param>
        /// <returns>Entity nếu tìm thấy, null nếu không</returns>
        /// <exception cref="ArgumentException">Khi fieldName không tồn tại trong entity</exception>
        public async Task<T> GetByFieldName(object value, string fieldName)
        {
            using (var conn = _databaseConnection.Connection())
            {
                List<string> properties = GetTableProperty();

                // 1. Map column DB property C#
                var propInfo = GetPropertyByColumnName<T>(fieldName);
                if (propInfo == null)
                    throw new ArgumentException($"Field '{fieldName}' not found in entity");

                // 2. Build SELECT với alias để Dapper map được
                var selectColumns = new List<string>();
                foreach (var property in properties)
                {
                    if (GetPropertyByColumnName<T>(property) == null) continue;
                    selectColumns.Add($"{property} AS {GetPropertyByColumnName<T>(property).Name}");
                }

                // 3. SQL
                var sql = $@"SELECT {string.Join(", ", selectColumns)} FROM {_tableName} WHERE {fieldName} = @value";

                // 4. Param
                var param = new DynamicParameters();
                param.Add("value", value);

                return await conn.QueryFirstOrDefaultAsync<T>(sql, param);
            }
        }

        /// <summary>
        /// Cập nhật giá trị một trường cho nhiều bản ghi
        /// Sử dụng cho cập nhật hàng loạt (ví dụ: thay đổi trạng thái)
        /// </summary>
        /// <param name="ids">Danh sách ID các bản ghi cần cập nhật</param>
        /// <param name="value">Giá trị mới</param>
        /// <param name="fieldName">Tên cột cần cập nhật</param>
        /// <returns>OperationResult chứa kết quả cập nhật</returns>
        /// <exception cref="ArgumentException">Khi fieldName không tồn tại trong entity</exception>
        public async Task<OperationResult<T>> UpdateFieldNameByIds(IEnumerable<Guid> ids, object value, string fieldName)
        {
            using (var conn = _databaseConnection.Connection())
            {
                List<string> properties = GetTableProperty();
                var tableId = _tableName + "_id";

                // 1. Map column DB property C#
                var propInfo = GetPropertyByColumnName<T>(fieldName);
                if (propInfo == null)
                    throw new ArgumentException($"Field '{fieldName}' not found in entity");

                // 2. SQL
                var sql = $@"UPDATE {_tableName} SET {fieldName}=@value WHERE {tableId} IN @ids";

                // 3. Param
                var param = new DynamicParameters();
                param.Add("ids", ids);
                param.Add("value", value);

                var affected = await conn.ExecuteAsync(sql, param);
                return new OperationResult<T>
                {
                    StatusCode = affected > 0 ? (int)Commons.StatusCode.Success : (int)Commons.StatusCode.BadRequest,
                    IsSuccess = affected > 0 ? true : false,
                    Message = affected > 0 ? "" : "Đã có lỗi xảy ra."
                };
            }
        }

        /// <summary>
        /// Xóa nhiều bản ghi theo danh sách ID
        /// Sử dụng DELETE ... WHERE IN
        /// </summary>
        /// <param name="ids">Danh sách ID các bản ghi cần xóa</param>
        /// <returns>OperationResult chứa kết quả xóa</returns>
        public async Task<OperationResult<T>> DeleteByIds(IEnumerable<Guid> ids)
        {
            using (var conn = _databaseConnection.Connection())
            {
                List<string> properties = GetTableProperty();
                var tableId = _tableName + "_id";

                // 2. SQL
                var sql = $@"DELETE FROM {_tableName} WHERE {tableId} IN @ids";
                // 3. Param
                var param = new DynamicParameters();
                param.Add("ids", ids);

                var affected = await conn.ExecuteAsync(sql, param);
                return new OperationResult<T>
                {
                    StatusCode = affected > 0 ? (int)Commons.StatusCode.Deleted : (int)Commons.StatusCode.BadRequest,
                    IsSuccess = affected > 0 ? true : false,
                    Message = affected > 0 ? "" : "Không có bản ghi nào bị xóa."
                };
            }
        }
    }
}
