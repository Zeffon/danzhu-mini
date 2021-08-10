import { Paging } from '../utils/paging';
import { Http } from "../utils/http";
import { GroupApplyStatus } from "../core/enum"

class Group {

  static listCreate() {
    return new Paging({
      url: `group/list/create`
    })
  }

  static listJoin() {
    return new Paging({
      url: `group/list/join`
    })
  }

  static async userQuitGroup(gid) {
    return await Http.request({
      url: `group/user/quit/${gid}`,
      method: 'POST'
    })
  }

  static async getDetail(gid) {
    return await Http.request({
      url: `group/detail/${gid}`
    })
  }

  static async getMoreDetail(gid) {
    return await Http.request({
      url: `group/detail/${gid}/more`
    })
  }

  static listAllUser(gid) {
    return new Paging({
      url: `group/list/user?id=${gid}`,
    }, 10)
  }

  static listAllUserApply(gid) {
    return new Paging({
      url: `group/admin/user/apply?id=${gid}`,
    }, 10)
  }

  static async adminChangeApplyStatus(id, status) {
    return await Http.request({
      url: `group/admin/change/apply`,
      data: {
        id,
        status
      },
      method: 'POST'
    })
  }

  // ids 为user_group中的id
  static async adminDeleteUser(ids) {
    return await Http.request({
      url: `group/admin/delete`,
      data: {
        ids
      },
      method: 'DELETE'
    })
  }

  // id 为user_group中的id
  static async adminUpdateUser(id, remark) {
    return await Http.request({
      url: `group/admin/update`,
      data: {
        id,
        remark
      },
      method: 'POST'
    })
  }

  static async adminVerify(gid) {
    return await Http.request({
      url: `group/verify/${gid}`
    })
  }

  static async adminAddUser(gid, code, remark) {
    return await Http.request({
      url: `group/admin/add`,
      method: 'POST',
      data: {
        gid,
        code,
        remark
      }
    })
  }

  static async getCurUser(gid) {
    return await Http.request({
      url: `group/user/${gid}`
    })
  }

  // id为user_group中的id
  static async userUpdateRemark(id, remark) {
    return await Http.request({
      url: `group/user/update`,
      data: {
        id,
        remark
      },
      method: 'POST'
    })
  }

  static async userQuitGroup(gid) {
    return await Http.request({
      url: `group/user/quit/${gid}`,
      method: 'POST'
    })
  }

  static async createGroup(title, status, summary, remark) {
    return await Http.request({
      url: `group/create`,
      method: 'POST',
      data: {
        title,
        status,
        summary,
        remark
      }
    })
  }

  static async updateGroup(id, title, status, summary) {
    return await Http.request({
      url: `group/update`,
      method: 'POST',
      data: {
        id,
        title,
        status,
        summary
      }
    })
  }

  static async disbandGroup(id, code) {
    return await Http.request({
      url: `group/disband`,
      method: 'DELETE',
      data: {
        id,
        code
      }
    })
  }

  static async userAddGroup(id) {
    return await Http.request({
      url: `group/user/add`,
      method: 'POST',
      data: {
        id
      }
    })
  }

  static getPagingByStatus(status) {
    return new Paging({
      url: `group/by/status/${status}`
    })
  }

  static async getWaitingCount() {
    const applyPage = await Http.request({
      url: `group/by/status/${GroupApplyStatus.WAITING}`,
      data: {
        start: 0,
        count: 1
      }
    })
    return applyPage.total
  }

  static async getPassedCount() {
    const applyPage = await Http.request({
      url: `group/by/status/${GroupApplyStatus.PASSED}`,
      data: {
        start: 0,
        count: 1
      }
    })
    return applyPage.total
  }

  static async getRefusedCount() {
    const applyPage = await Http.request({
      url: `group/by/status/${GroupApplyStatus.REFUSED}`,
      data: {
        start: 0,
        count: 1
      }
    })
    return applyPage.total
  }

}

export {
  Group
}