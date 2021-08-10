import { Collect } from "../../models/collect";
import { getLineYMDHM } from "../../utils/date";
import { accSubtract, accDivider } from "../../utils/number";
import { linShowToast } from "../../utils/ui";

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
    },

    onLoad: function (options) {
        let cid = options.cid
        this._initData(cid)
    },

    async onConfirm() {
        let cid = this.data.collect.id
		let title = this.data.inputTitle
		let summary = this.data.inputSummary
		let validPeriod = this.data.dateNum
        let userNumber = this.data.numberNum
        if (title === '') {
			linShowToast('error', '标题不能为空', 1000)
			return
		}
        wx.lin.showLoading({
			type: "flash",
			fullScreen: true,
			color: "#09AAFF"
		})
		let res = await Collect.updateCollect(cid, title, summary, validPeriod, userNumber)
        wx.lin.hideLoading()
        if(res.code === 0) {
            linShowToast('success', '修改成功')
            this._initData(cid)
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
    
    async _initData(cid) {
        const collect = await Collect.getDetail(cid)
        let end_time = getLineYMDHM(collect.end_time)
        let period = this.calPeriod(collect.end_time)
        this.setData({
            collect,
            end_time,
            period,
            inputTitle: collect.title,
            inputSummary: collect.summary,
            numberNum: collect.user_limit
        })
    },

    // 计算出过期时间与现在时间戳差值，13位时间戳需要除以1000
    calPeriod(endTime) {
        let res = accSubtract(endTime, new Date().getTime())
        let period = accDivider(res, 1000)
        if (period < 0) {
            return 0
        }
        return period
    }

})