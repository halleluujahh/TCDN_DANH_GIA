import axiosInstance from "./axios-config";

class BaseApi {
  endpoint: string;
  axios: import("axios").AxiosInstance;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.axios = axiosInstance;
  }

  /**
   * GET request
   * @param {string} url - The endpoint URL.
   * @param {object} [params={}] - Query parameters.
   * @returns {Promise<any>} - The response data.
   **/
  async get(url: string, params: object = {}): Promise<any> {
    return this.axios.get(`${this.endpoint}${url}`, { params });
  }

  /**
   * POST request
   * @param {string} url - The endpoint URL.
   * @param {object} data - The request payload.
   * @returns {Promise<any>} - The response data.
   **/
  async post(url: string, data: object): Promise<any> {
    return this.axios.post(`${this.endpoint}${url}`, data);
  }

  /** PUT request
   * @param {string} url - The endpoint URL.
   * @param {object} data - The request payload.
   * @returns {Promise<any>} - The response data.
   **/
  async put(url: string, data: object): Promise<any> {
    return this.axios.put(`${this.endpoint}${url}`, data);
  }

  /** DELETE Multiple request
   * @param {Set<string> | string[]} ids - The ids to delete.
   * @returns {Promise<any>} - The response data.
   **/
  async deleteMultiple(url: string, ids: Set<string> | string[]): Promise<any> {
    const idList = ids instanceof Set ? Array.from(ids) : ids;
    const formData = new FormData();
    idList.forEach((id) => formData.append("ids", id));
    return this.axios.delete(`${this.endpoint}${url}`, { data: formData });
  }
}

export default BaseApi;
