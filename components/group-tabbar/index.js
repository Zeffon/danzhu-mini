import { linShowToast } from "../../utils/ui";
import { Group } from "../../models/group"

Component({

  properties: {
    isAdmin: {
      type: Boolean,
      value: false
    },
    showCheck: {
      type: Boolean,
      value: false
    },
    group: Object,
    curUser: Object,
    showBtnRealm: {
      type: Boolean,
      value: false
    },
    isAdd: {
      type: Boolean,
      value: false
    },
    isBtnEdit: {
      type: Boolean,
      value: false
    },
    totalUserCount: {
      type: Number,
      value: 0
    },
    allChecked: {
      type: Boolean,
      value: false
    }
  },

  data: {

  },

  methods: {

    onAddUser(event) {
      this.triggerEvent('newtap', {}, { bubbles: true, composed: true })
    },

    onUpdateRemark(event) {
      this.triggerEvent('realmtap', { showBtnRealm: true, isAdd: false }, { bubbles: true, composed: true })
    },

    onClosePopup(event) {
      // 注意：该方法监听的l-popup的lintap也会监听到z-tabbar-realm的自定的方法
      // 判断 event.detail 为true 则是背景点击关闭事件
      let isClickPopup = event.detail
      if (isClickPopup === true) {
        this.triggerEvent('realmtap', { showBtnRealm: false }, { bubbles: true, composed: true })
      }
    },

    onQuitGroup() {
      let gid = this.properties.group.id
      wx.lin.showDialog({
        type: "confirm",
        title: "是否确认要退出该用户组？",
        success: (res) => {
          if (res.confirm) {
            this._quitGroup(gid)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    async _quitGroup(gid) {
      let res = await Group.userQuitGroup(gid);
      if (res.code === 0) {
        linShowToast('success', '退出成功')
        // 休眠0.8秒，再向切换到用户组列表页面
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/group/group'
          })
        }, 800)
      }
    },

    onCheckUser() {
      this.triggerEvent('checktap', { showCheck: true }, { bubbles: true, composed: true })
    },

    onCancelCheck() {
      this.triggerEvent('checktap', { showCheck: false }, { bubbles: true, composed: true })
    },
    
    onCheckAll(event) {
      let allChecked = event.detail.checked
      this.triggerEvent('allcheck', { allChecked, composed: true })
    },

    onBatchDeleteUser(event) {
      let isClick = event.currentTarget.dataset.isClick === 0 ? false : true
      this.triggerEvent('batchdelete', {isClick}, { bubbles: true, composed: true })
    },

    onShare(event) {
      let gid = event.currentTarget.dataset.gid
      wx.redirectTo({
        url: `/pages/group-share/group-share?gid=${gid}`,
      })
    }
  }
})
