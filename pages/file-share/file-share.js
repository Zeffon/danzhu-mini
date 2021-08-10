
import { File } from "../../models/file";

Page({

    data: {
        showUploading: false,
        showOperate: false,
        isOwn: false
    },

    onLoad: function (options) {
        let uid = options.uid
        this._initData(uid)
    },

    onOpenOperate(event) {
        let file = event.detail.item
        this.setData({
            file,
            showOperate: true
        })
    },

    onCloseOperate(event) {
        this.setData({
            showOperate: false
        })
    },

    async _initData(uid) {
        wx.lin.showLoading({
            color: '#09AAFF',
            type: 'flash',
            fullScreen: true
        })
        let isOwn = uid === undefined ? true : false
        let detail = null
        if (uid === undefined) {
            detail = await File.listMyShareFile()
        } else {
            detail = await File.listShareFile(uid)
        }
        wx.lin.hideLoading()
        this.setData({
            detail,
            isOwn
        })
    },

})