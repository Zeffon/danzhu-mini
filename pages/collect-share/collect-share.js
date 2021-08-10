import { Collect } from "../../models/collect";
import { getLineYMDHM } from "../../utils/date";
import { Permission } from "../../models/permission";

Page({

    data: {
        shareBtn: false
    },

    onLoad: function (options) {
        let cid = options.cid
        if(options.scene !== undefined) {
            cid = decodeURIComponent(options.scene)
        }
        this._initCollect(cid)
    },

    async _initCollect(cid) {
        let collect = await Collect.getDetail(cid)
        let shareBtn = await Permission.getShareBtn()
        if (!collect) {
            return
        }
        collect.end_time = getLineYMDHM(collect.end_time)
        this.setData({
            collect,
            shareBtn
        })
    },

    onShareAppMessage() {
        let cid = this.data.collect.id
        let title = this.data.collect.title
        return {
            title: `${title} 向你收集文件`,
            path: `/pages/collect-upload/collect-upload?cid=${cid}`
        }
    },

    onGotoWxa() {
        let cid = this.data.collect.id
        let page = `pages/collect-upload/collect-upload`
        wx.navigateTo({
            url: `/pages/wxa/wxa?cid=${cid}&page=${page}&width=200`,
        })
    }
})