import BaseApi from "../base-api";

class ShiftApi extends BaseApi {
  constructor() {
    super("/Shift");
  }

  /**
   * Cập nhật trạng thái cho danh sách ca.
   * @param {Array<string>} ids - Danh sách id ca.
   * @returns {Promise<*>} Promise kết quả cập nhật.
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
