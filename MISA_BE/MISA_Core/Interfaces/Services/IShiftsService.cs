using MISA_Core.Dtos.Request;
using MISA_Core.Dtos.Response;
using MISA_Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Interface.Service
{
    public interface IShiftsService
    {
        Task<IEnumerable<Shift>> GetAll();
        Task<OperationResult<Shift>> GetPagination(int pageSize, int currentPage);
        Task<OperationResult<Shift>> GetPaginationFilter(int pageSize, int currentPage, ShiftFilter shiftFilter);
        Task<OperationResult<Shift>> SaveShift(ShiftAddDtoRequest shift);
        Task<OperationResult<Shift>> Update(Guid id, ShiftUpdateDtoRequest shift);
        Task<OperationResult<Shift>> UpdateShiftStatusToActiveById(List<Guid> id);
        Task<OperationResult<Shift>> UpdateShiftStatusToInactiveById(List<Guid> id);
        Task<OperationResult<Shift>> DeleteByIds(List<Guid> ids);

    }
}
