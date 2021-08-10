import { Group } from "../../models/group";
import { getWindowHeightRpx } from "../../utils/system";
import { linShowToast } from "../../utils/ui";
import { UserItem } from "../../models/user-item";

Page({

  data: {
    userPaging: null,
    curUser: Object,
    user: Object,
    group: Object,
    isEdit: false,
    isAdmin: false,
    showRealm: false,
    showBtnRealm: false,
    isBtnEdit: false,
    loadingType: 'loading',
    bottomLoading: true,
    isEmpty: false,
    showCheck: false,
    allChecked: false,
    totalUserCount: 0
  },

  async onLoad(options) {
    let gid = options.gid
    this._initAllData(gid)
  },

  onEllipsis(event) {
    let user = event.detail.user
    this.setData({
      user,
      showRealm: true,
      isEdit: false
    })
  },

  onClosePopup(event) {
    if (event.detail === true) {
      this.setData({
        showRealm: false,
        isEdit: false
      })
    }
  },

  onShowRealm(event) {
    let showRealm = event.detail.showRealm
    this.setData({
      showRealm
    })
  },

  onShowEdit(event) {
    let isEdit = event.detail.isEdit
    this.setData({
      isEdit
    })
  },

  async onDeleteUser(event) {
    const users = this.data.users
    // 数组中剔除要删除的元素
    const gid = this.data.group.id
    this._initUserList(gid)
    this.data.group.user_number = this.data.group.user_number - 1
    // 重新计算是否全选或者反选状态
    let allChecked = true
    users.forEach(item => {
      if(!item.checked) {
        allChecked = false
      }
    })

    this.setData({
      group: this.data.group,
      users,
      allChecked,
      showRealm: false,
      isEdit: false
    })
  },

  onUpdateRemark(event) {
    linShowToast("success", "更新成功")
    let user = event.detail.user
    setTimeout(() => {
      this._updateRemark(user)
    }, 1000)
  },

  onShowBtnEdit(event) {
    let isBtnEdit = event.detail.isEdit
    this.setData({
      isBtnEdit
    })
  },

  onAddUser() {
    const gid = this.data.group.id
    this._initUserList(gid)
    setTimeout(() => {
      this.setData({
        showBtnRealm: false
      })
    }, 500)
  },

  onShowBtnRealm(event) {
    let showBtnRealm = event.detail.showBtnRealm
    let isAdd = event.detail.isAdd
    this.setData({
      showBtnRealm,
      isAdd
    })
  },

  onAddClick() {
    this.setData({
      showBtnRealm: true,
      showEdit: false,
      isAdd: true
    })
  },

  onUserUpdateRemark(event) {
    linShowToast("success", "更新成功")
    let curUser = event.detail.user
    let users = this.data.users
    users.forEach(item => {
      if(item.id === curUser.id) {
        item.remark = curUser.remark
      }
    })
    setTimeout(() => {
      this.setData({
        curUser,
        users,
        isBtnEdit: false
      })
    }, 800)
  },

  onAdminAddUser(event) {
    const gid = this.data.group.id
    this._initUserList(gid)
  },

  onShowCheck(event) {
    let showCheck = event.detail.showCheck
    this.setData({
      showCheck
    })
  },

  onCheckItem(event) {
    let user = event.detail.user
    let users = this.data.users

    users.forEach(item => {
      if(item.id === user.id) {
        item.checked = user.checked
      }
    })
    let allChecked = true
    let totalUserCount = 0
    users.forEach(item => {
      if(!item.checked) {
        allChecked = false
      } else {
        totalUserCount += 1
      }
    })
    this.setData({
      users,
      allChecked,
      totalUserCount
    })
  },

  onAllChecked(event) {
    let allChecked = event.detail.allChecked
    let users = this.data.users
    if (allChecked) {
      users.forEach(item => {
        item.checked = true
      })
      this.setData({
        users,
        allChecked,
        totalUserCount: users.length
      })
    } else {
      users.forEach(item => {
        item.checked = false
      })
      this.setData({
        users,
        allChecked,
        totalUserCount: 0
      })
    }
  },

  async onBatchDelete(event) {
    let isClick = event.detail.isClick
    if(!isClick) {
      return
    }
    let users = this.data.users
    let deleteUsers = new Array()
    users.forEach(item => {
      if(item.checked) {
        deleteUsers.push(item.id)
      }
    })
    this.data.group.user_number = this.data.group.user_number - deleteUsers.length
    wx.lin.showDialog({
      type: "confirm",
      title: `是否删除所选择的${deleteUsers.length}个成员？`,
      success: (res) => {
        if (res.confirm) {
          this._batchDeleteUser(deleteUsers)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  async _batchDeleteUser(deleteUsers) {
    const gid = this.data.group.id
    let res = await Group.adminDeleteUser(deleteUsers)
    if(res.code === 0) {
      linShowToast('success', `成功删除${deleteUsers.length}人`)
      this._initUserList(gid)
      this.setData({
        group: this.data.group,
        allChecked: false,
        totalUserCount: 0
      })
    }
  },

  async _initAllData(gid) {
    const group = await Group.getMoreDetail(gid)
    const windowHeight = await getWindowHeightRpx()
    const isAdmin = await Group.adminVerify(gid)
    const h = windowHeight - 100
    this.setData({
      isAdmin,
      group,
      h
    })
    this._initUserList(gid)
    this._initCurUser(gid)
  },

  async _initCurUser(gid) {
    const curUser = await Group.getCurUser(gid)
    if (!curUser) {
      return
    }
    this.setData({
      curUser
    })
  },

  async _initUserList(gid) {
    const paging = Group.listAllUser(gid)
    this.data.userPaging = paging
    const userData = await paging.getMoreData()
    this._bindUserData(userData)
  },

  _updateRemark(user) {
    const userData = this.data.userPaging.accumulator
    userData.forEach(o => {
      if (o.id === user.id) {
        o.remark = user.remark
      }
    })
    this.setData({
      user,
      users: userData,
      showRealm: false,
      isEdit: false
    })
  },

  _bindUserData(data, refresh = false) {
    if (data.empty) {
      this._empty()
      return
    }
    if (data.accumulator.length !== 0) {
      let users = data.accumulator
      users = users.map(user => {
        return new UserItem(user)
      })
      this._bindCheckUser(users, refresh)
    }
    if (!data.moreData) {
      this.setData({
        loadingType: 'end'
      })
    }
  },

  // 拉取数据或者新增成员，allChecked的状态都应该为false
  _bindCheckUser(users, refresh) {
    if (!refresh) {
      this.setData({
        users,
        allChecked: false,
        isEmpty: false,
        bottomLoading: true
      });
    } else {
      let usersCheck = this.data.users
      let newIndex = usersCheck.length
      for (let i = newIndex; i < users.length; i++) {
        usersCheck.push(users[i])
      }
      this.setData({
        users: usersCheck,
        allChecked: false,
        bottomLoading: true
      });
    }
  },

  _empty() {
    this.setData({
      isEmpty: true,
      bottomLoading: false
    })
  },

  onShow: function () {

  },


  onPullDownRefresh: function () {
    const gid = this.data.group.id
    this._initUserList(gid)
  },

  onReachBottom: async function () {

  },

  // scroll-view无法触发onReachBottom，需要bindscrolltolower事件来触发
  async onScrollTolower() {
    const data = await this.data.userPaging.getMoreData()
    if (!data) {
      return
    }
    this._bindUserData(data, true)
  },

  onShareAppMessage: function () {

  }
})