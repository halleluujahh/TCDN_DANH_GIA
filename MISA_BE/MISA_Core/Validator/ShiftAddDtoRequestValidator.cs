using FluentValidation;
using MISA_Core.Dtos.Request;
using MISA_Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Validator
{
    public class ShiftAddDtoRequestValidator : AbstractValidator<ShiftAddDtoRequest>
    {
        public ShiftAddDtoRequestValidator()
        {
            RuleFor(x => x.ShiftCode).NotEmpty().WithMessage("Mã ca không được để trống.")
                .MaximumLength(20).WithMessage("Mã ca tối đa 20 ký tự.");
            RuleFor(x => x.ShiftName).NotEmpty().WithMessage("Tên ca không được để trống.")
                .MaximumLength(50).WithMessage("Mã ca tối đa 50 ký tự.");
            RuleFor(x => x.ShiftBeginTime).NotEmpty().WithMessage("Giờ vào ca không được để trống.")
                .MaximumLength(5).WithMessage("Giờ vào ca tối đa 5 ký tự");
            RuleFor(x => x.ShiftEndTime).NotEmpty().WithMessage("Giờ hết ca không được để trống.")
                .MaximumLength(5).WithMessage("Giờ hết ca tối đa 5 ký tự");
        }
    }
}
