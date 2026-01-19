import axiosInstance from './axiosConfig'

class BaseApiService {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.axios = axiosInstance
  }

  get(url, params = {}) {
    return this.axios.get(`${this.endpoint}${url}`, { params })
  }

  create(data) {
    return this.axios.post(this.endpoint, data)
  }

  update(id, data) {
    return this.axios.put(`${this.endpoint}/update/${id}`, data)
  }

  deleteMultiple(ids) {
    return this.axios.delete(this.endpoint, { data: { ids } })
  }

  post(url, data) {
    return this.axios.post(`${this.endpoint}${url}`, data)
  }

  put(url, data) {
    return this.axios.put(`${this.endpoint}${url}`, data)
  }

  delete(url, data) {
    return this.axios.delete(`${this.endpoint}${url}`, data)
  }
}

export default BaseApiService; 
