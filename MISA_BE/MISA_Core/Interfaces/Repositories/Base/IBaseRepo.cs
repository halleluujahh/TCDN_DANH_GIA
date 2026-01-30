/// <summary>
/// IBaseRepo - Interface định nghĩa các chức năng CRUD cơ bản cho mọi entity
/// Generic interface cho Repository Pattern:
/// - GetAll, GetById, GetByFieldName: Truy vấn dữ liệu
/// - GetPagination: Phân trang
/// - Save: Tạo mới
/// - Update, UpdateByFieldName: Cập nhật
/// - DeleteByIds: Xóa
/// Implement bởi BaseRepo trong MISA_Infrastructure layer
/// Created By: hanv - 20/01/2026
/// </summary>
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
        Task<OperationResult<T>> UpdateFieldNameByIds(IEnumerable<Guid> ids, object value, string fieldName);
        Task<OperationResult<T>> DeleteByIds(IEnumerable<Guid> ids);
    }
}
