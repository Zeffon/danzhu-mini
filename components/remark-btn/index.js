import { linShowToast } from "../../utils/ui";
import { Group } from "../../models/group";

Component({

  properties: {
    user: Object,
    hasbBtn: {
      type: Boolean,
      value: true
    },
    isAdmin: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    'user': function (user) {
      if (!user) {
        return
      }
      this.setData({
        remarkText: user.remark
      })
    }
  },

  data: {
    remarkText: Object
  },

  methods: {
    onCancel() {
      this.triggerEvent('edittap', { isEdit: false }, { bubbles: true, composed: true })
    },

    async onSubmit(event) {
      let id = this.properties.user.id
      let remarkText = this.data.remarkText
      let isAdmin = this.data.isAdmin
      if (this._validValue(remarkText)) {
        let res = null
        if (isAdmin) {
          res = await Group.adminUpdateUser(id, remarkText)
        } else {
          res = await Group.userUpdateRemark(id, remarkText)
        }
        if (res.code === 0) {
          this.properties.user.remark = remarkText
          let user = this.properties.user
          this.triggerEvent('submittap', { user }, { bubbles: true, composed: true })
        }
      }
    },

    onInputRemark(event) {
      let newRemark = event.detail.newRemark
      this.data.remarkText = newRemark
    },

    // 返回值isValid为true 说明必填信息都填了，否则相反
    _validValue(remarkText) {
      let isValid = true
      remarkText.forEach(o => {
        if (o.value === "") {
          linShowToast("error", "必填信息不能为空")
          isValid = false
          return isValid
        }
      })
      return isValid
    },
  }
})
