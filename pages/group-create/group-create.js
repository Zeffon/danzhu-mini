import { linShowToast } from "../../utils/ui";
import { Group } from "../../models/group"

Page({

  data: {
    isCreated: false,
    remark: [],
    inputTitle: '',
    status: 0,
    inputSummary: '',
    titleRule: [{
      required: true,
      message: "用户组名称不能为空"
    }, {
      type: 'string',
      min: 1,
      max: 20,
      message: "名称的长度不能超过20"
    }],
    valueRule: [{
      required: true,
      message: "备注信息不能为空"
    }, {
      type: 'string',
      min: 1,
      max: 4,
      message: "备注信息的长度不能超过4"
    }],
  },

  onLoad: function (options) {

  },

  onAddRemark() {
    let remark = this.data.remark
    if (remark.length > 2) {
      linShowToast('error', '不能创建超过3个备注', 1500)
      return
    }
    let o = { "key": "", "value": "" }
    remark.push(o)
    this.setData({
      remark
    })
  },

  onInputValue(event) {
    let index = event.currentTarget.dataset.index
    let key = event.detail.value
    let remark = this.data.remark
    for (let i = 0; i < remark.length; i++) {
      if (i === index) {
        remark[i].key = key
      }
    }
    this.setData({
      remark
    })
  },

  onReduceRemark(event) {
    let index = event.currentTarget.dataset.index
    let remark = this.data.remark
    for (let i = 0; i < remark.length; i++) {
      if (i === index) {
        remark.splice(i, 1)
      }
    }
    this.setData({
      remark
    })
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

  async onConfirm() {
    let title = this.data.inputTitle
    let status = this.data.status
    let summary = this.data.inputSummary
    let remark = this.data.remark
    if (title === '') {
      linShowToast('error', '标题不能为空', 1000)
      return
    }
    wx.lin.showLoading({
      type: "flash",
      fullScreen: true,
      color: "#09AAFF"
    })
    const res = await Group.createGroup(title, status, summary, remark)
    wx.lin.hideLoading()
    linShowToast('success', '新建成功')
    wx.redirectTo({
      url: `/pages/group-share/group-share?gid=${res.id}`
    })

  },

  onShareAppMessage: function () {

  }
})