import { linShowToast } from "../../utils/ui";
import { Group } from "../../models/group";
import { Collect } from "../../models/collect";

Page({

	data: {
		inputTitle: '',
		inputSummary: '',
		titleRule: [{
			required: true,
			message: "收集夹名称不能为空"
		}, {
			type: 'string',
			min: 1,
			max: 20,
			message: "名称的长度不能超过20"
		}],
		dateNum: 3,
		numberRange: [10, 20, 30, 50, 60, 80, 100],
		numberNum: 50,
		switchValue: false,
		hasGroup: true,
		selectGroup: ''
	},

	onLoad: function (options) {
		this._initMyGroup()
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

	onSelectValidPeriod(event) {
		let dateNum = event.detail.count
		this.setData({
			dateNum
		})
	},

	onSelectNumberNum(event) {
		let numberNum = event.detail.value;
		this.setData({
			numberNum
		})
	},

	onSwitchItem(event) {
		let value = event.detail.value
		if (value) { // value为true时， 状态时关闭的
			this.setData({
				selectGroup: ''
			})
		}
		this.setData({
			switchValue: !value
		})
	},

	onSelectGroup(event) {
		let selectGroup = event.detail.selectGroup
		this.setData({
			selectGroup
		})
	},

	async onGetMoreGroup(event) {
		const data = await this.data.paging.getMoreData()
		console.log(data)
		if (!data) {
			return
		}
		this._bindGroupList(data)
	},

	onGotoCreateGroup() {
		wx.redirectTo({
			url: `/pages/group-create/group-create`,
		})
	},

	async onConfirm() {
		let title = this.data.inputTitle
		let summary = this.data.inputSummary
		let validPeriod = this.data.dateNum
		let userNumber = this.data.numberNum
		let switchValue = this.data.switchValue
		if (title === '') {
			linShowToast('error', '标题不能为空', 1000)
			return
		}
		let selectGroup = this.data.selectGroup
		let gid = ''
		if (switchValue && selectGroup == '') {
			linShowToast('error', '你还没有指定用户组哦')
			return
		}
		if (switchValue) {
			gid = selectGroup.id
		}
		wx.lin.showLoading({
			type: "flash",
			fullScreen: true,
			color: "#09AAFF"
		})
		let res = await Collect.createCollect(title, summary, validPeriod, userNumber, gid)
		wx.lin.hideLoading()
		linShowToast('success', '新建成功')
		wx.redirectTo({
			url: `/pages/collect-share/collect-share?cid=${res.id}`
		})
	},

	async _initMyGroup() {
		const paging = Group.listCreate()
		this.data.paging = paging
		const createData = await paging.getMoreData()
		this._bindGroupList(createData)
	},

	_bindGroupList(data) {
		if (data.empty) {
			this.setData({
				hasGroup: false
			})
			return
		}
		if (data.accumulator.length !== 0) {
			this.setData({
				groups: data.accumulator
			})
		}
	},

	onReachBottom: function () {

	},

	onShareAppMessage: function () {

	}
})