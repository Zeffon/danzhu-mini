import { getLineYMDHM } from "../utils/date";

class UserItemApply {
  id
  status
  code
  wx_info
  create_time

  constructor(user) {
    this.id = user.id
    this.status = user.status
    this.code = user.code
    this.wx_info = user.wx_info
    this.create_time = getLineYMDHM(user.create_time)
  }

}

export {
  UserItemApply
}