using Dapper;
using Microsoft.Extensions.Logging;
using MISA_Core.Dtos.Request;
using MISA_Core.Dtos.Response;
using MISA_Core.Entities;
using MISA_Core.Enums;
using MISA_Core.Interface.Repository;
using MISA_Core.Interfaces;
using MISA_Core.Interfaces.Repositories.Base;
using MISA_Infrastructure.Repositories.Base;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MISA_Core.Enums.Commons;

namespace MISA_Infrastructure.Repository
{
    public class ShiftsRepo : BaseRepo<Shift>, IShiftsRepo
    {
        private IDatabaseConnection _databaseConnection;
        public ShiftsRepo(IDatabaseConnection connection) : base(connection)
        {
            _databaseConnection = connection;
        }

        public async Task<OperationResult<Shift>> GetPaginationFilter(int pageSize, int currentPage, ShiftFilter shiftFilter)
        {
            using (var conn = _databaseConnection.Connection())
            {
                var tableId = _tableName + "_id";
                var whereClauses = new List<string>();
                var orderClauses = new List<string>();
                var param = new DynamicParameters();

                /* SEARCH KEYWORD */
                if (!string.IsNullOrWhiteSpace(shiftFilter?.SearchKeyword))
                {
                    whereClauses.Add(@"
                    (
                        shift_code LIKE @keyword OR
                        shift_name LIKE @keyword OR
                        shift_working_time LIKE @keyword OR
                        shift_breaking_time LIKE @keyword OR
                        shift_status LIKE @keyword OR
                        created_by LIKE @keyword OR
                        modified_by LIKE @keyword
                    )");
                    param.Add("keyword", $"%{shiftFilter.SearchKeyword}%");
                }

                /*  2. FILTER + SORT */
                if (shiftFilter?.FilterByShiftColumn != null)
                {
                    int index = 0;

                    foreach (var filter in shiftFilter.FilterByShiftColumn)
                    {
                        //if (filter.Name == "shift_status" && filter.Value == Commons.StatusShift.Active.ToString())
                        //{
                        //    whereClauses.Add(@"shift_status LIKE @active");
                        //    param.Add("active", $"%{Commons.StatusShift.Active.ToString()}%");
                        //}
                        //if (filter.Name == "shift_status" && filter.Value == Commons.StatusShift.Inactive.ToString())
                        //{
                        //    whereClauses.Add(@"shift_status LIKE @inactive");
                        //    param.Add("inactive", $"%{Commons.StatusShift.Inactive.ToString()}%");
                        //}

                        // Map column DB
                        var propInfo = GetPropertyByColumnName<Shift>(filter.Name);
                        if (propInfo == null) continue;

                        var columnName = filter.Name;
                        var paramName = $"param_{index}";

                        // FILTER
                        switch (filter.filterColumnType)
                        {
                            // DIFFERENT
                            case FilterColumnType.Different:
                                whereClauses.Add($"{columnName} != @{paramName}");
                                param.Add(paramName, filter.Value);
                                break;

                            // CONTAINS
                            case FilterColumnType.Contains:
                                whereClauses.Add($"{columnName} LIKE @{paramName}");
                                param.Add(paramName, $"%{filter.Value}%");
                                break;

                            // NOT CONTAINS
                            case FilterColumnType.NotContains:
                                whereClauses.Add($"{columnName} NOT LIKE @{paramName}");
                                param.Add(paramName, $"%{filter.Value}%");
                                break;

                            // START WITH
                            case FilterColumnType.StartWith:
                                whereClauses.Add($"{columnName} LIKE @{paramName}");
                                param.Add(paramName, $"{filter.Value}%");
                                break;

                            // END WITH
                            case FilterColumnType.EndWith:
                                whereClauses.Add($"{columnName} LIKE @{paramName}");
                                param.Add(paramName, $"%{filter.Value}");
                                break;
                        }

                        // DATE FILTER
                        switch (filter.dateFilterColumnType)
                        {
                            case DateFilterColumnType.Empty:
                                whereClauses.Add($"{columnName} IS NULL");
                                break;

                            case DateFilterColumnType.NotEmpty:
                                whereClauses.Add($"{columnName} IS NOT NULL");
                                break;

                            default:
                                // Các case còn lại cần Value
                                if (!string.IsNullOrWhiteSpace(filter.Value) &&
                                    DateTime.TryParseExact(
                                        filter.Value,
                                        "dd/MM/yyyy",
                                        CultureInfo.InvariantCulture,
                                        DateTimeStyles.None,
                                        out DateTime parsedDate))
                                {
                                    switch (filter.dateFilterColumnType)
                                    {
                                        case DateFilterColumnType.Equal:
                                            whereClauses.Add($"DATE({columnName}) = @{paramName}");
                                            param.Add(paramName, parsedDate.Date);
                                            break;

                                        case DateFilterColumnType.Different:
                                            whereClauses.Add($"DATE({columnName}) != @{paramName}");
                                            param.Add(paramName, parsedDate.Date);
                                            break;

                                        case DateFilterColumnType.Less:
                                            whereClauses.Add($"{columnName} < @{paramName}");
                                            param.Add(paramName, parsedDate.Date);
                                            break;

                                        case DateFilterColumnType.LessOrEqual:
                                            whereClauses.Add($"{columnName} < @{paramName}");
                                            param.Add(paramName, parsedDate.Date.AddDays(1));
                                            break;

                                        case DateFilterColumnType.Greater:
                                            whereClauses.Add($"{columnName} >= @{paramName}");
                                            param.Add(paramName, parsedDate.Date.AddDays(1));
                                            break;

                                        case DateFilterColumnType.GreaterOrEqual:
                                            whereClauses.Add($"{columnName} >= @{paramName}");
                                            param.Add(paramName, parsedDate.Date);
                                            break;
                                    }
                                }
                                break;
                        }

                        // SORT
                        switch (filter.sortType)
                        {
                            case SortType.Ascending:
                                orderClauses.Add($"{columnName} {("ASC")}");
                                break;
                            case SortType.Descending:
                                orderClauses.Add($"{columnName} {("DESC")}");
                                break;
                            case SortType.Default:
                                break;
                        }

                        index++;
                    }
                }

                /* BUILD SQL */
                var whereSql = whereClauses.Any()
                    ? "WHERE " + string.Join(" AND ", whereClauses)
                    : "";

                var orderSql = orderClauses.Any()
                    ? "ORDER BY " + string.Join(", ", orderClauses)
                    : "";

                List<string> properties = GetTableProperty();
                var selectColumns = new List<string>();
                foreach (var property in properties)
                {
                    var propInfo = GetPropertyByColumnName<Shift>(property);
                    if (propInfo == null) continue;
                    selectColumns.Add($"{property} AS {propInfo.Name}");
                }
                var sql = $@"SELECT {string.Join(", ", selectColumns)} FROM {_tableName} {whereSql} {orderSql} LIMIT @limit OFFSET @offset";

                param.Add("limit", pageSize);
                param.Add("offset", currentPage * pageSize);

                var items = await conn.QueryAsync<Shift>(sql, param);

                return new OperationResult<Shift>
                {
                    ListData = items,
                    StatusCode = (int)Commons.StatusCode.Success,
                    IsSuccess = true
                };
            }
        }

    }
}
