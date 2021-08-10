import { getLineYMDHM } from "../utils/date";
import { accSubtract, accDivider } from "../utils/number";

class CollectItem {
  id
  title
  code
  user_number
  user_limit
  create_time
  period
  checked = false

  constructor(collect) {
    this.id = collect.id
    this.title = collect.title
    this.code = collect.code
    this.user_number = collect.user_number
    this.user_limit = collect.user_limit
    this.create_time = getLineYMDHM(collect.create_time)
    this.period = CollectItem.calPeriod(collect.end_time)

  }

  // 计算出过期时间与现在时间戳差值，13位时间戳需要除以1000
  static calPeriod(endTime) {
    let res = accSubtract(endTime, new Date().getTime())
    let period = accDivider(res, 1000)
    if(period < 0) {
      this.is_period = true
      return
    }
    return period
  }

}

export {
  CollectItem
}