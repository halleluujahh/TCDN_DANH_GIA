/// <summary>
/// IShiftsRepo - Interface định nghĩa data access cho Ca làm việc
/// Kế thừa IBaseRepo để có các chức năng CRUD cơ bản
/// Mở rộng thêm: GetPaginationFilter cho lọc nâng cao
/// Implement bởi ShiftsRepo trong MISA_Infrastructure layer
/// Created By: hanv - 20/01/2026
/// </summary>
using MISA_Core.Dtos;
using MISA_Core.Dtos.Request;
using MISA_Core.Dtos.Response;
using MISA_Core.Entities;
using MISA_Core.Interfaces.Repositories.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Interface.Repository
{
    public interface IShiftsRepo : IBaseRepo<Shift>
    {
        Task<OperationResult<Shift>> GetPaginationFilter(int pageSize, int currentPage, ShiftFilter shiftFilter);
    }
}
