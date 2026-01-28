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
   * @param {string} url - The endpoint URL.
   * @returns {Promise<any>} - The response data.
   **/
  async deleteMultiple(ids: Array<string>): Promise<any> {
    const formData = new FormData();
    formData.append("ids", ids as any);
    return this.axios.delete(this.endpoint, { data: formData });
  }
}

export default BaseApi;
