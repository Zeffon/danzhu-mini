
import { Http } from "../utils/http";

class User {
  static async getCode() {
    return await Http.request({
      url: `user/code`
    })
  }
  
  static async updateUserInfo(data) {
    return Http.request({
      url: `user/wx_info`,
      data,
      method: 'POST'
    })
  }
}

export {
  User
}