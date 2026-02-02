import BaseApi from "../base-api";

class ShiftApi extends BaseApi {
  constructor() {
    super("/Shift");
  }

  /**
   * Cập nhật trạng thái cho danh sách ca
   * @param {string} url - URL endpoint
   * @param {Set<string>} ids - Danh sách ID ca làm việc
   * @returns {Promise<any>} Promise kết quả cập nhật
   * Created By hanv 02/02/2026
   */
  updateStatus(url: string, ids: Set<string>): Promise<any> {
    const formData = new FormData();

    ids.forEach((id) => {
      formData.append("ids", id);
    });
    return this.put(url, formData);
  }
}

export const shiftApi = new ShiftApi();
