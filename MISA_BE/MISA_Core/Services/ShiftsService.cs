/// <summary>
/// ShiftsService - Service xử lý nghiệp vụ Ca làm việc
/// Cung cấp các chức năng CRUD đầy đủ cho ca làm việc:
/// - Tạo mới, cập nhật, xóa ca làm việc
/// - Tính toán tự động thời gian làm việc và thời gian nghỉ giữa ca
/// - Xác thực dữ liệu nghiệp vụ phức tạp (thời gian trùng lặp, khoảng thời gian hợp lệ)
/// - Hỗ trợ tìm kiếm, lọc, sắp xếp, phân trang dữ liệu
/// - Quản lý trạng thái ca (Active/Inactive)
/// Sử dụng FluentValidation để validate dữ liệu input
/// Created By: hanv - 20/01/2026
/// </summary>
using FluentValidation;
using FluentValidation.Results;
using MISA_Core.Attributes;
using MISA_Core.Dtos.Request;
using MISA_Core.Dtos.Response;
using MISA_Core.Entities;
using MISA_Core.Enums;
using MISA_Core.Exceptions;
using MISA_Core.Interface.Repository;
using MISA_Core.Interface.Service;
using MISA_Core.Validator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MISA_Core.Service
{
    public class ShiftsService : IShiftsService
    {
        private IValidator<ShiftAddDtoRequest> _validator;
        private IValidator<ShiftUpdateDtoRequest> _validatorUpdate;

        private IShiftsRepo _shiftsRepo;
        
        /// <summary>
        /// Constructor - Khởi tạo ShiftsService với các dependencies
        /// </summary>
        /// <param name="shiftsRepo">Repository để thao tác với database</param>
        /// <param name="validator">Validator cho ShiftAddDtoRequest</param>
        /// <param name="validatorUpdate">Validator cho ShiftUpdateDtoRequest</param>
        public ShiftsService(IShiftsRepo shiftsRepo, IValidator<ShiftAddDtoRequest> validator, IValidator<ShiftUpdateDtoRequest> validatorUpdate)
        {
            _validator = validator;
            _shiftsRepo = shiftsRepo;
            _validatorUpdate = validatorUpdate;
        }

        /// <summary>
        /// Lấy danh sách tất cả ca làm việc trong hệ thống
        /// Không phân trang, không lọc
        /// </summary>
        /// <returns>Danh sách tất cả ca làm việc</returns>
        public async Task<IEnumerable<Shift>> GetAll()
        {
            return await _shiftsRepo.GetAll();
        }

        /// <summary>
        /// Lấy danh sách ca làm việc có phân trang
        /// </summary>
        /// <param name="pageSize">Số lượng bản ghi trên mỗi trang</param>
        /// <param name="currentPage">Trang hiện tại (bắt đầu từ 0)</param>
        /// <returns>OperationResult chứa danh sách ca và tổng số bản ghi</returns>
        public async Task<OperationResult<Shift>> GetPagination(int pageSize, int currentPage)
        {
            return await _shiftsRepo.GetPagination(pageSize, currentPage);
        }
        
        /// <summary>
        /// Lấy danh sách ca làm việc có phân trang và lọc nâng cao
        /// Hỗ trợ: Tìm kiếm theo từ khóa, lọc theo nhiều cột, sắp xếp
        /// </summary>
        /// <param name="pageSize">Số lượng bản ghi trên mỗi trang</param>
        /// <param name="currentPage">Trang hiện tại (bắt đầu từ 0)</param>
        /// <param name="shiftFilter">Bộ lọc chứa từ khóa tìm kiếm và điều kiện lọc</param>
        /// <returns>OperationResult chứa danh sách ca đã lọc và tổng số bản ghi</returns>
        public async Task<OperationResult<Shift>> GetPaginationFilter(int pageSize, int currentPage, ShiftFilter shiftFilter)
        {
            return await _shiftsRepo.GetPaginationFilter(pageSize, currentPage, shiftFilter);
        }
        
        /// <summary>
        /// Tạo mới ca làm việc
        /// Thực hiện:
        /// 1. Validate dữ liệu đầu vào (FluentValidation)
        /// 2. Kiểm tra mã ca không bị trùng
        /// 3. Chuyển đổi DTO sang Entity
        /// 4. Tính toán thời gian làm việc và thời gian nghỉ
        /// 5. Lưu vào database với trạng thái Active
        /// </summary>
        /// <param name="shift">Thông tin ca làm việc cần tạo</param>
        /// <returns>OperationResult chứa ca vừa tạo</returns>
        /// <exception cref="BadRequestException">Khi validation fail hoặc mã ca bị trùng</exception>
        public async Task<OperationResult<Shift>> SaveShift(ShiftAddDtoRequest shift)
        {
            var resultValidator = await _validator.ValidateAsync(shift);
            if (!resultValidator.IsValid)
            {
                IDictionary<string, string> errorsFieldMsg = new Dictionary<string, string>();
                foreach (ValidationFailure error in resultValidator.Errors)
                {
                    errorsFieldMsg.Add(Constants.Common.ErrorKeys.FieldName, error.PropertyName);
                    errorsFieldMsg.Add(Constants.Common.ErrorKeys.ErrorMessage, error.ErrorMessage);
                    throw new BadRequestException(errorsFieldMsg, "Field validation errors");
                }
            }
            Shift shiftToSave = await _shiftsRepo.GetByFieldName(shift.ShiftCode, "shift_code");
            if (shiftToSave != null)
            {
                IDictionary<string, string> errorsFieldMsg = new Dictionary<string, string>();
                errorsFieldMsg.Add(Constants.Common.ErrorKeys.FieldName, "ShiftCode");
                errorsFieldMsg.Add(Constants.Common.ErrorKeys.ErrorMessage, $"Ca làm việc <b>{shift.ShiftCode}</b> đã tồn tại. Vui lòng kiểm tra lại.");
                throw new BadRequestException(errorsFieldMsg, "Field validation errors");
            }
            shiftToSave = new Shift
            {
                ShiftId = Guid.NewGuid(),
                ShiftCode = shift.ShiftCode,
                ShiftName = shift.ShiftName,
                ShiftDescription = shift.ShiftDescription,
                ShiftBeginTime = TimeSpan.Parse(shift.ShiftBeginTime),
                ShiftEndTime = TimeSpan.Parse(shift.ShiftEndTime),
                ShiftBeginBreakTime = TimeSpan.TryParse(shift.ShiftBeginBreakTime, out var beginBreakTime) ? beginBreakTime : null,
                ShiftEndBreakTime = TimeSpan.TryParse(shift.ShiftEndBreakTime, out var endBreakTime) ? endBreakTime : null,
                ShiftWorkingTime = shift.ShiftWorkingTime ?? 0f,
                ShiftBreakingTime = shift.ShiftBreakingTime ?? 0f,
                CreatedBy = "ADMIN",
                CreatedDate = DateTime.Now,
                ShiftStatus = (int)Commons.StatusShift.Active,
            };

            return await _shiftsRepo.Save(shiftToSave);
        }

        /// <summary>
        /// Cập nhật thông tin ca làm việc
        /// Thực hiện:
        /// 1. Validate dữ liệu đầu vào
        /// 2. Kiểm tra mã ca không trùng với ca khác
        /// 3. Kiểm tra ca cần cập nhật phải tồn tại
        /// 4. Cập nhật thông tin ModifiedBy và ModifiedDate
        /// 5. Lưu vào database
        /// </summary>
        /// <param name="id">ID của ca cần cập nhật</param>
        /// <param name="shift">Thông tin ca mới</param>
        /// <returns>OperationResult chứa ca đã cập nhật</returns>
        /// <exception cref="BadRequestException">Khi validation fail hoặc mã ca bị trùng</exception>
        /// <exception cref="NotFoundException">Khi ca không tồn tại</exception>
        public async Task<OperationResult<Shift>> Update(Guid id, ShiftUpdateDtoRequest shift)
        {
            // 1. Validate DTO
            var resultValidator = await _validatorUpdate.ValidateAsync(shift);
            if (!resultValidator.IsValid)
            {
                IDictionary<string, string> errorsFieldMsg = new Dictionary<string, string>();
                foreach (ValidationFailure error in resultValidator.Errors)
                {
                    errorsFieldMsg.Add(Constants.Common.ErrorKeys.FieldName, error.PropertyName);
                    errorsFieldMsg.Add(Constants.Common.ErrorKeys.ErrorMessage, error.ErrorMessage);
                    throw new BadRequestException(errorsFieldMsg, "Field validation errors");
                }
            }

            Shift shiftToUpdate = await _shiftsRepo.GetByFieldName(
                shift.ShiftCode,
                typeof(Shift).GetProperty(nameof(shift.ShiftCode)).GetCustomAttribute<ColumnAttribute>().ColumnName
            );
            if (shiftToUpdate != null && shiftToUpdate.ShiftId != id)
            {
                IDictionary<string, string> errorsFieldMsg = new Dictionary<string, string>();
                errorsFieldMsg.Add(Constants.Common.ErrorKeys.FieldName, "ShiftCode");
                errorsFieldMsg.Add(Constants.Common.ErrorKeys.ErrorMessage, $"Ca làm việc <b>{shift.ShiftCode}</b> đã tồn tại. Vui lòng kiểm tra lại.");
                throw new BadRequestException(errorsFieldMsg, "Field validation errors");
            }

            shiftToUpdate = await _shiftsRepo.GetById(id);
            if (shiftToUpdate == null)
            {
                IDictionary<string, string> errorsFieldMsg = new Dictionary<string, string>();
                errorsFieldMsg.Add(Constants.Common.ErrorKeys.FieldName, "ShiftCode");
                errorsFieldMsg.Add(Constants.Common.ErrorKeys.ErrorMessage, $"Ca làm việc <b>{shift.ShiftCode}</b> không tồn tại. Vui lòng kiểm tra lại.");
                throw new NotFoundException(errorsFieldMsg, "Field validation errors");
            }

            // 2. Map DTO -> Entity
            if (shiftToUpdate == null)
            {
                shiftToUpdate = new Shift();
            }

            shiftToUpdate.ShiftId = shiftToUpdate.CreatedBy == null ? Guid.NewGuid() : id;
            shiftToUpdate.ShiftCode = shift.ShiftCode;
            shiftToUpdate.ShiftName = shift.ShiftName;
            shiftToUpdate.ShiftDescription = shift.ShiftDescription;
            shiftToUpdate.ShiftBeginTime = TimeSpan.Parse(shift.ShiftBeginTime);
            shiftToUpdate.ShiftEndTime = TimeSpan.Parse(shift.ShiftEndTime);
            shiftToUpdate.ShiftBeginBreakTime = TimeSpan.TryParse(shift.ShiftBeginBreakTime, out var beginBreakTime) ? beginBreakTime : null;
            shiftToUpdate.ShiftEndBreakTime = TimeSpan.TryParse(shift.ShiftEndBreakTime, out var endBreakTime) ? endBreakTime : null;
            shiftToUpdate.ShiftWorkingTime = shift.ShiftWorkingTime ?? 0f;
            shiftToUpdate.ShiftBreakingTime = shift.ShiftBreakingTime ?? 0f;
            shiftToUpdate.CreatedBy = shiftToUpdate.CreatedBy == null ? "ADMIN" : shiftToUpdate.CreatedBy;
            shiftToUpdate.CreatedDate = shiftToUpdate.CreatedBy == null ? DateTime.Now : shiftToUpdate.CreatedDate;
            shiftToUpdate.ModifiedBy = shiftToUpdate.CreatedBy == null ? "" : "ADMIN";
            shiftToUpdate.ModifiedDate = shiftToUpdate.CreatedBy == null ? shiftToUpdate.ModifiedDate : DateTime.Now;
            shiftToUpdate.ShiftStatus = shift.ShiftStatus;

            // 4. Call repository
            return await _shiftsRepo.Update(shiftToUpdate);
        }

        /// <summary>
        /// Cập nhật trạng thái nhiều ca làm việc thành Active (Đang sử dụng)
        /// Kiểm tra tất cả các ca phải tồn tại trước khi cập nhật
        /// </summary>
        /// <param name="ids">Danh sách ID các ca cần kích hoạt</param>
        /// <returns>OperationResult chứa kết quả cập nhật</returns>
        /// <exception cref="BadRequestException">Khi danh sách ID rỗng</exception>
        /// <exception cref="NotFoundException">Khi một trong các ca không tồn tại</exception>
        public async Task<OperationResult<Shift>> UpdateShiftStatusToActiveById(List<Guid> ids)
        {
            if (ids.Count() <= 0) throw new BadRequestException(null, "Không tìm thấy id.");
            foreach (var id in ids)
            {
                Shift shiftToUpdate = await _shiftsRepo.GetById(id);
                if (shiftToUpdate == null)
                {
                    IDictionary<string, string> errorsFieldMsg = new Dictionary<string, string>();
                    errorsFieldMsg.Add(Constants.Common.ErrorKeys.FieldName, "ShiftCode");
                    errorsFieldMsg.Add(Constants.Common.ErrorKeys.ErrorMessage, $"Ca làm việc có ID <b>{id}</b> không tồn tại. Vui lòng kiểm tra lại.");
                    throw new NotFoundException(errorsFieldMsg, "Field validation errors");
                }
            }

            return await _shiftsRepo.UpdateByFieldName(ids, 1, "shift_status");
        }
        
        /// <summary>
        /// Cập nhật trạng thái nhiều ca làm việc thành Inactive (Ngừng sử dụng)
        /// Kiểm tra tất cả các ca phải tồn tại trước khi cập nhật
        /// </summary>
        /// <param name="ids">Danh sách ID các ca cần ngừng sử dụng</param>
        /// <returns>OperationResult chứa kết quả cập nhật</returns>
        /// <exception cref="BadRequestException">Khi danh sách ID rỗng</exception>
        /// <exception cref="NotFoundException">Khi một trong các ca không tồn tại</exception>
        public async Task<OperationResult<Shift>> UpdateShiftStatusToInactiveById(List<Guid> ids)
        {
            if (ids.Count() <= 0) throw new BadRequestException(null, "Không tìm thấy id.");
            foreach (var id in ids)
            {
                Shift shiftToUpdate = await _shiftsRepo.GetById(id);
                if (shiftToUpdate == null)
                {
                    IDictionary<string, string> errorsFieldMsg = new Dictionary<string, string>();
                    errorsFieldMsg.Add(Constants.Common.ErrorKeys.FieldName, "ShiftCode");
                    errorsFieldMsg.Add(Constants.Common.ErrorKeys.ErrorMessage, $"Ca làm việc có ID <b>{id}</b> không tồn tại. Vui lòng kiểm tra lại.");
                    throw new NotFoundException(errorsFieldMsg, "Field validation errors");
                }
            }

            return await _shiftsRepo.UpdateByFieldName(ids, 0, "shift_status");
        }

        /// <summary>
        /// Xóa nhiều ca làm việc theo danh sách ID
        /// Thực hiện xóa hàng loạt trong database
        /// </summary>
        /// <param name="ids">Danh sách ID các ca cần xóa</param>
        /// <returns>OperationResult chứa kết quả xóa</returns>
        public async Task<OperationResult<Shift>> DeleteByIds(List<Guid> ids)
        {
            return await _shiftsRepo.DeleteByIds(ids);
        }
    }
}
