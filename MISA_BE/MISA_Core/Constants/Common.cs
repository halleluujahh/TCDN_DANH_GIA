/// <summary>
/// Common - Chứa các hằng số chung cho toàn ứng dụng
/// Hiện tại chứa:
/// - ErrorKeys: Các key chuẩn cho Dictionary lỗi
///   + FieldName: Key cho tên trường bị lỗi
///   + ErrorMessage: Key cho thông báo lỗi
/// Sử dụng trong Service layer khi xử lý exception
/// Đảm bảo tính nhất quán khi trả về lỗi
/// Created By: hanv - 20/01/2026
/// </summary>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Constants
{
    public static class Common
    {
        public static class ErrorKeys
        {
            public const string FieldName = "FieldName";
            public const string ErrorMessage = "ErrorMessage";
        }
    }
}
