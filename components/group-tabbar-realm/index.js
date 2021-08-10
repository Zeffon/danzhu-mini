import { linShowToast } from "../../utils/ui";
import { Group } from "../../models/group"

Component({
  properties: {
    isAdd: {
      type: Boolean,
      value: false
    },
    isBtnEdit: {
      type: Boolean,
      value: false
    },
    group: Object,
    curUser: Object
  },

  observers: {
    'curUser': function (curUser) {
      if (!curUser) {
        return
      }
      this.setData({
        _curUser: curUser
      })
    }
  },

  data: {
    code: "",
    codeRule: [{
      required: true,
      message: "用户编号不能为空"
    }, {
      type: 'string',
      len: 10,
      message: "用户编号的长度不正确"
    }]
  },

  methods: {
    onInputCode(event) {
      let code = event.detail.value
      this.data.code = code
    },

    onInputRemark(event) {
      let newRemark = event.detail.newRemark
      this.data.remark = newRemark
    },

    onClearCode(event) {
      this.data.code = ""
    },

    onShowRealm() {
      this.triggerEvent('realmtap', { showBtnRealm: false }, { bubbles: true, composed: true })
    },

    onShowEdit() {
      this.triggerEvent('edittap', { isEdit: true }, { bubbles: true, composed: true })
    },

    async onAddUser() {
      let gid = this.properties.group.id
      let code = this.data.code
      let remark = this.properties.group.remark
      if (!this._checkCode(code)) {
        return
      }
      let res = await Group.adminAddUser(gid, code, remark)
      if (res === null) {
        linShowToast("error", "无法匹配该用户的编号")
        return
      }
      if (res.code === 0) {
        this.setData({
          code: ""
        })
        linShowToast("success", "新增成功")
        setTimeout(() => {
          this.triggerEvent('addtap', {}, { bubbles: true, composed: true })
        }, 800)
      }
    },

    onUserUpdateRemark(event) {
      const user = event.detail.user
      let isBtnEdit = false
      this.triggerEvent('usersubmit', { user, isBtnEdit }, { bubbles: true, composed: true })
    },

    _checkCode(code) {
      if (code.length == "") {
        linShowToast("error", "用户编号不能为空")
        return false
      }
      if (code.length != 10) {
        linShowToast("error", "用户编号的长度不正确")
        return false
      }
      return true
    },

    // 返回值isValid为true 说明必填信息都填了，否则相反 (TIP:取消了新增时输入备注信息，改为用户自己输入，故该方法并没有调用)
    _checkRemark(remark) {
      let isValid = true
      remark.forEach(o => {
        if (o.value === "") {
          linShowToast("error", "必填信息不能为空")
          isValid = false
          return
        }
      })
      return isValid
    },
  }
})
