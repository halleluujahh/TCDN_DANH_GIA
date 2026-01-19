using MISA_Core.Dtos.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Interfaces.Repositories.Base
{
    public interface IBaseRepo<T>
    {
        Task<IEnumerable<T>> GetAll();
        Task<OperationResult<T>> GetPagination(int pageSize, int currentPage);
        Task<T> GetById(Guid id);
        Task<T> GetByFieldName(object value, string fieldName);
        Task<OperationResult<T>> Save(T item);
        Task<OperationResult<T>> Update(T item);
        Task<OperationResult<T>> UpdateByFieldName(IEnumerable<Guid> ids, object value, string fieldName);
        Task<OperationResult<T>> DeleteByIds(IEnumerable<Guid> ids);
    }
}
