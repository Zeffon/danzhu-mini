import { getLineYMDHM } from "../utils/date";

class UserItem {
  uid
  id
  code
  wx_info
  remark
  create_time
  checked = false

  constructor(user) {
    this.uid = user.uid
    this.id = user.id
    this.code = user.code
    this.wx_info = user.wx_info
    this.remark = user.remark
    this.create_time = getLineYMDHM(user.create_time)
  }

}

export {
  UserItem
}