/// <summary>
/// IAuditable - Interface định nghĩa các thuộc tính Audit cho Entity
/// Các thuộc tính theo dõi thông tin tạo/sửa:
/// - CreatedBy: Người tạo
/// - CreatedDate: Ngày tạo
/// - ModifiedBy: Người sửa cuối
/// - ModifiedDate: Ngày sửa cuối
/// Implement bởi các Entity cần theo dõi lịch sử thay đổi
/// Created By: hanv - 20/01/2026
/// </summary>
using MISA_Core.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA_Core.Entities.Base
{
    public interface IAuditable
    {
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
