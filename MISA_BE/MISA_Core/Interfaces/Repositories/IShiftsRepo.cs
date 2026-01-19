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
