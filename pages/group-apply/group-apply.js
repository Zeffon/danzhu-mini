import { Group } from "../../models/group";
import { UserItemApply } from "../../models/user-item-apply";
import { linShowToast } from "../../utils/ui";

Page({

  data: {
    userPaging: null,
    isEmpty: false,
    loadingType: 'loading',
    bottomLoading: true,
    users: Array
  },

  onLoad: function (options) {
    let gid = options.gid
    this._initUserApply(gid)
  },

  async onChangeStatus(event) {
    let id = event.detail.id
    let status = event.detail.status
    let users = this.data.users
    users.forEach(item => {
      if(item.id === id) {
        item.status = status
      }
    })
    let res = await Group.adminChangeApplyStatus(id, status)
    if (res.code === 30007) {
      linShowToast('error', '该用户已在用户组，无需重复操作', 2000)
    }
    if(res.code === 0) {
      linShowToast('success', '操作成功', 1000)
    }
    this.setData({
      users
    })
  },

  onChooseStatus(event) {
    let index = event.detail.index
    let id = this.properties.user.id
    let status = index + 1
    console.log(id)
  },

  async _initUserApply(gid) {
    const paging = Group.listAllUserApply(gid)
    this.data.userPaging = paging
    const userData = await paging.getMoreData()
    this._bindUserData(userData)
  },

  _bindUserData(data) {
    if (data.empty) {
      this._empty()
      return
    }
    if (data.accumulator.length !== 0) {
      let users = data.accumulator
      users = users.map(user => {
        return new UserItemApply(user)
      })
      this.setData({
        users,
        bottomLoading: true
      })
    }
    if (!data.moreData) {
      this.setData({
        loadingType: 'end'
      })
    }
  },

  _empty() {
    this.setData({
      isEmpty: true,
      bottomLoading: false
    })
  },

  async onReachBottom () {
    const data = await this.data.userPaging.getMoreData()
    if (!data) {
      return
    }
    this._bindUserData(data)
  },

})