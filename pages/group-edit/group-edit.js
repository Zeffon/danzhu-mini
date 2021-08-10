import { Group } from "../../models/group";
import { linShowToast } from "../../utils/ui";

Page({

  data: {
    group: Object,
    inputTitle: '',
    status: 0,
    inputSummary: '',
    inputCode: '',
    titleRule: [{
      required: true,
      message: "名称不能为空"
    }, {
      type: 'string',
      min: 1,
      max: 20,
      message: "名称的长度不能超过20"
    }],
    showDialog: false
  },

  onLoad: function (options) {
    this._initData(options.gid)
  },

  onReturn(event) {
    wx.navigateBack({
      delta: 1,
    })
  },

  onDisBand(event) {
    this.setData({
      showDialog: true
    })

  },

  async onConfirmCode(event) {
    let code = this.data.inputCode
    let id = this.data.group.id
    if (code === '') {
      linShowToast('error', '用户组编号不能为空')
      return
    }
    if (code.length !== 10) {
      linShowToast('error', '用户组编号长度好像不对')
      return
    }
    let res = await Group.disbandGroup(id, code)
    if (res.code === 0) {
      linShowToast('success', '解散成功')
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/group/group',
        })
      }, 800)

    }
  },

  onInputCode(event) {
    let code = event.detail.value
    this.data.inputCode = code
  },

  async onUpdate(event) {
    let id = this.data.group.id
    let title = this.data.inputTitle
    let summary = this.data.inputSummary
    let status = this.data.status
    if (title === '') {
      linShowToast('error', '名称不能为空')
      return
    }
    let res = await Group.updateGroup(id, title, status, summary)
    if (res.code === 0) {
      linShowToast('success', '修改成功')
    }
  },

  onInputTitle(event) {
    let title = event.detail.value
    this.data.inputTitle = title
  },

  onClear() {
    this.data.inputTitle = ''
  },

  onInputSummary(event) {
    let summary = event.detail.value
    this.data.inputSummary = summary
  },

  onChangeStatus(event) {
    let status = event.detail.key
    this.setData({
      status
    })
  },

  async _initData(gid) {
    let group = await Group.getDetail(gid)
    if(!group) {
      return
    }
    this.data.inputTitle = group.title
    this.data.inputSummary = group.summary
    this.setData({
      group,
      status: group.status
    })
  },

})