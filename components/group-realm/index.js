import { getLineYMDHM } from "../../utils/date";
import { Group } from "../../models/group";
import { linShowToast } from "../../utils/ui";

Component({

  properties: {
    user: Object,
    isEdit: {
      type: Boolean,
      value: false
    },
    isAdmin: {
      type: Boolean,
      value: false
    }
  },

  data: {

  },

  observers: {
    'user': function (user) {
      if (!user) {
        return
      }
      let create_time = getLineYMDHM(user.create_time)
      this.setData({
        create_time
      })
    }
  },

  methods: {
    async onEditClick(event) {
      this.triggerEvent('edittap', { isEdit: true }, { bubbles: true, composed: true })
    },

    onShowRealm() {
      this.triggerEvent('realmtap', { showRealm: false }, { bubbles: true, composed: true })
    },

    async onDeleteUser(event) {
      let id = event.target.dataset.id
      wx.lin.showDialog({
        type: "confirm",
        title: "是否确认要删除该用户？",
        success: (res) => {
          if (res.confirm) {
            this._deleteUser(id)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    async _deleteUser(id) {
      let ids = [id]
      let res = await Group.adminDeleteUser(ids);
      if (res.code === 0) {
        linShowToast('success', '移除成功')
        // 休眠0.8秒，再向父组件触发事件
        setTimeout(() => {
          this.triggerEvent('deletetap', { id })
        }, 800)
      }
    }

  }
})
