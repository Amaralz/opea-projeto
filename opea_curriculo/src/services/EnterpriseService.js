import { axiosClient } from '../config/axiosClient'

export default class EnterpriseService {
  constructor() {
    this.api = axiosClient
  }

  getEnterprises() {
    return this.api.get('/')
  }

  createEnterprise(params) {
    return this.api.post('/', params);
  }

  updateEnterprise(enterpriseId, params) {
    return this.api.put(`/${enterpriseId}`, params);
  }

  deleteEnterprise(enterpriseId) {
    return this.api.delete(`/${enterpriseId}`)
  }
}
