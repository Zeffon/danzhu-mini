import { getLineYMDHM } from "../utils/date";

class GroupData {
  createTime

  constructor(group) {
    Object.assign(this, group)
    this.createTime = getLineYMDHM(group.create_time)
  }
}

export {
  GroupData
}