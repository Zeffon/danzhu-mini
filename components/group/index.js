
import { GroupData } from "../../models/group-data";
import { Group } from "../../models/group";
import { GroupType } from "../../core/enum";
import { linShowToast } from "../../utils/ui";

Component({

  properties: {
    group: Object,
    isSearch: {
      type: Boolean,
      value: false
    },
    type: {
      type: Number,
      value: GroupType.Other
    }
  },

  data: {
    _group: Object,
    showAddDialog: false
  },

  observers: {
    'group': function (group) {
      if (!group) {
        return
      }
      this.setData({
        _group: new GroupData(group),
      })
    }
  },

  methods: {
    onGotoDetail(event) {
      let gid = event.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/group-detail/group-detail?gid=${gid}`
      })
    },

    onGotoApply(event) {
      let gid = event.currentTarget.dataset.gid
      wx.navigateTo({
        url: `/pages/group-apply/group-apply?gid=${gid}`,
      })
    },
    
    async onQuitGroup(event) {
      let gid = event.currentTarget.dataset.id
      let isSearch = this.properties.isSearch
      console.log("触发了吗")
      console.log(isSearch)
      // 为什么在这里触发showDialog后,在/pages/group/group无法第二次触发该函数？
      if(isSearch) {
        wx.lin.showDialog({
          type: "confirm",
          title: "是否确认要退出该用户组？",
          success: (res) => {
            if (res.confirm) {
              this._userConfirmQuit(gid)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        this.triggerEvent('userquit', { gid }, { bubbles: true, composed: true })
      }
    },

    async onJoinGroup(event) {
      let gid = event.currentTarget.dataset.id
      let status = this.properties.group.status
      let remark = this.data._group.remark
      if(status === 2) {
        linShowToast('error', '当前用户组不允许用户加入')
        return
      }
      let res = await Group.userAddGroup(gid, remark)
      if(res.code === 0) {
        if(status === 0) {
          linShowToast('success', '加入成功', 800)
          wx.navigateTo({
            url: `/pages/group-detail/group-detail?gid=${gid}`,
          })
        }
        if(status === 1) {
          linShowToast('success', '已提交申请，等待管理员审核')
        }
      }
    },

    async _userConfirmQuit(gid) {
      const res = await Group.userQuitGroup(gid)
      if (res.code === 0) {
        linShowToast('success', '退出成功')
        setTimeout(() => {
          this.setData({
            type: GroupType.Other
          })
        }, 800)
      }
    },
  }
})
