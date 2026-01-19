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
        public ShiftsService(IShiftsRepo shiftsRepo, IValidator<ShiftAddDtoRequest> validator, IValidator<ShiftUpdateDtoRequest> validatorUpdate)
        {
            _validator = validator;
            _shiftsRepo = shiftsRepo;
            _validatorUpdate = validatorUpdate;
        }

        public async Task<IEnumerable<Shift>> GetAll()
        {
            return await _shiftsRepo.GetAll();
        }

        public async Task<OperationResult<Shift>> GetPagination(int pageSize, int currentPage)
        {
            return await _shiftsRepo.GetPagination(pageSize, currentPage);
        }
        public async Task<OperationResult<Shift>> GetPaginationFilter(int pageSize, int currentPage, ShiftFilter shiftFilter)
        {
            return await _shiftsRepo.GetPaginationFilter(pageSize, currentPage, shiftFilter);
        }
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

        public async Task<OperationResult<Shift>> DeleteByIds(List<Guid> ids)
        {
            return await _shiftsRepo.DeleteByIds(ids);
        }
    }
}
