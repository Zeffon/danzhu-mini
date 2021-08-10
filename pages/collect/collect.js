import { CollectType } from "../../core/enum";
import { Collect } from "../../models/collect";
import { File } from "../../models/file";
import { CollectItem } from "../../models/collect-item";
import { linShowToast } from "../../utils/ui"

Page({

	data: {
		activeKey: CollectType.COLLECT,
		collects: [],
		loadingType1: 'loading',
		loadingType2: 'loading',
		bottomLoading1: true,
		bottomLoading2: true,
		collectPaging: null,
		filePaging: null,
		isEmpty1: false,
		isEmpty2: false,
		logtap: 0,
		isChecked: false,
		allChecked: false,
		selectedNum: 0
	},

	onLoad: async function (options) {
		const activeKey = this.data.activeKey
		this._initItems(activeKey)
	},

	onTabpanelChange(event) {
		const activeKey = event.detail.activeKey
		this._initItems(activeKey)
	},

	onGotoCollect() {
		wx.navigateTo({
			url: `/pages/collect-create/collect-create`,
		})
	},

	onItemTap(event) {
		let cid = event.detail.cid
		let longtap = this.data.logtap
		let isChecked = this.data.isChecked
		if (longtap === 0 && !isChecked) { // 如果longtap是0, 并且!isChecked == 不是在选择状态，才是点击查看详情
			wx.navigateTo({
				url: `/pages/collect-detail/collect-detail?cid=${cid}`,
			})
		} else if (longtap === 1) {
			this.data.logtap = 0
		} else if (isChecked) {
			let collects = this.data.collects
			let allChecked = true
			let selectedNum = 0
			collects.forEach(item => {
				if (item.id === cid) { // 将选中元素的状态进行选反
					item.checked = !item.checked
				}
				if (!item.checked) {  // 如果是有个没被选中，allChecked状态还是false
					allChecked = false
				}
				if (item.checked) { // 计算被选中的个数
					selectedNum = selectedNum + 1
				}
			})
			this.setData({
				collects,
				allChecked,
				selectedNum
			})
		}
	},

	onOpenCheck(event) {
		this.data.logtap = 1
		this.setData({
			isChecked: true
		})
	},

	onCloseCheck() {
		let collects = this.data.collects
		collects.forEach(item => {
			item.checked = false
		})
		this.setData({
			collects,
			isChecked: false,
			allChecked: false,
			selectedNum: 0
		})
	},

	onSelectAll() {
		let collects = this.data.collects
		let selectedNum = collects.length
		collects.forEach(item => {
			item.checked = true
		})
		this.setData({
			collects,
			allChecked: true,
			selectedNum
		})
	},

	onCancelAll() {
		let collects = this.data.collects
		collects.forEach(item => {
			item.checked = false
		})
		this.setData({
			collects,
			allChecked: false,
			selectedNum: 0
		})
	},

	async onDeleteItem() {
		let collects = this.data.collects
		let deleteIds = new Array()
		collects.forEach(item => {
			if (item.checked) {
				deleteIds.push(item.id)
			}
		})
		wx.lin.showDialog({
			type: "confirm",
			title: `是否删除所选择的${deleteIds.length}个收集夹？`,
			success: (res) => {
				if (res.confirm) {
					this._batchDelete(deleteIds)
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},

	async _batchDelete(deleteIds) {
		let res = await Collect.deleteCollect(deleteIds)
		if (res.code === 0) {
			linShowToast('success', `成功删除${deleteIds.length}个`)
			const activeKey = this.data.activeKey
			this._initItems(activeKey)
			this.setData({
				isChecked: false,
				allChecked: false
			})
		}
	},

	async _initItems(activeKey) {
		this.setData({
			activeKey
		})
		if (activeKey === CollectType.COLLECT) {
			this._initCollectItems()
		} else {
			this._initFileItems()
		}
	},

	async _initCollectItems() {
		this.data.collectPaging = Collect.getPagingByType(CollectType.COLLECT)
		const data = await this.data.collectPaging.getMoreData()
		if (!data) {
			return
		}
		this._bindCollectItems(data)
	},

	async _initFileItems() {
		this.data.filePaging = File.getPagingFile(CollectType.SEND)
		const data = await this.data.filePaging.getMoreData()
		if (!data) {
			return
		}
		this._bindFileItems(data)
	},

	_bindCollectItems(data, refresh = false) {
		if (data.empty) {
			this.setData({
				isEmpty1: true,
				bottomLoading1: false
			})
			return
		}
		if (data.accumulator.length !== 0) {
			let collects = data.accumulator
			collects = collects.map(item => {
				return new CollectItem(item)
			})
			this._bindCheckItem(collects, refresh)
		}
		if (!data.moreData) {
			this.setData({
				loadingType1: 'end'
			})
		}
	},

	_bindFileItems(data) {
		if (data.empty) {
			this.setData({
				isEmpty2: true,
				bottomLoading2: false
			})
			return
		}
		if (data.accumulator.length !== 0) {
			this.setData({
				files: data.accumulator,
				allChecked: false,
				bottomLoading2: true
			});
		}
		if (!data.moreData) {
			this.setData({
				loadingType2: 'end'
			})
		}
	},

	// 拉取数据，allChecked的状态都应该为false
	_bindCheckItem(collects, refresh) {
		if (!refresh) {
			this.setData({
				collects,
				allChecked: false,
				bottomLoading1: true
			});
		} else {
			let collectsCheck = this.data.collects
			let newIndex = collectsCheck.length
			for (let i = newIndex; i < collects.length; i++) {
				collectsCheck.push(collects[i])
			}
			this.setData({
				collects: collectsCheck,
				allChecked: false,
				bottomLoading1: true
			});
		}
	},

	onShow: function () {

	},

	async onReachBottom() {
		const activeKey = this.data.activeKey
		if (activeKey === CollectType.COLLECT) {
			const data = await this.data.collectPaging.getMoreData()
			if (!data) {
				return
			}
			this._bindCollectItems(data, true)
		} else {
			const data = await this.data.filePaging.getMoreData()
			if (!data) {
				return
			}
			this._bindFileItems(data)
		}

	},
})