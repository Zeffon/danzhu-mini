
import { Wxa } from "../../models/wxa";
import { Collect } from "../../models/collect";
import { Group } from "../../models/group";
import { getLineYMDHM } from "../../utils/date";
import { linShowToast } from "../../utils/ui";
import { AuthImage } from "../../core/enum";

Page({

    data: {

    },

    onLoad: function (options) {
        wx.lin.showLoading({
            color: '#09AAFF',
            type: 'flash',
            fullScreen: true
        })
        if (options.cid === undefined || options.cid === null) {
            this.initGroup(options)
        } else {
            this.initCollect(options)
        }
    },

    async initGroup(options) {
        let gid = options.gid
        let page = options.page
        let width = options.width
        let data = await Group.getDetail(gid)
        if (!data) {
            return
        }
        let base64Str = await Wxa.generateWxaCode(gid, page, width)
        wx.lin.hideLoading()
        this.saveImageToPhotosAlbum(base64Str)
        let src = `data:image/png;base64,${base64Str}`
        this.setData({
            data,
            src
        })
    },

    async initCollect(options) {
        let cid = options.cid
        let page = options.page
        let width = options.width
        let data = await Collect.getDetail(cid)
        if (!data) {
            return
        }
        data.end_time = getLineYMDHM(data.end_time)
        let base64Str = await Wxa.generateWxaCode(cid, page, width)
        wx.lin.hideLoading()
        this.saveImageToPhotosAlbum(base64Str)
        let src = `data:image/png;base64,${base64Str}`
        this.setData({
            data,
            src
        })
    },

    async saveImageToPhotosAlbum(data) {
        const authStatus = await this.hasAuthorizedSaveImage()
        if (authStatus === AuthImage.DENY) {
            this.showImageDialog(data)
            return
        }
        let fs = wx.getFileSystemManager()
        let timestamp = new Date().getTime()
        let filePath = `${wx.env.USER_DATA_PATH}/qrcode_${timestamp}.png`;
        fs.writeFile({
            filePath,
            data,
            encoding: 'base64',
            success: res => {
                wx.saveImageToPhotosAlbum({
                    filePath,
                    success: res => {
                        linShowToast('success', '已保存至手机相册')
                    },
                })
            }
        })
    },

    showImageDialog(data) {
        wx.lin.showDialog({
            type: "alert",
            title: "授权",
            content: "请先授权保存图片到你的相册",
            success: res => {
                if (res.confirm) {
                    wx.openSetting({
                        success: res => {
                            this.saveImageToPhotosAlbum(data)
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    async hasAuthorizedSaveImage() {
        const setting = await wx.getSetting({})
        const imageSetting = setting.authSetting['scope.writePhotosAlbum']
        if (imageSetting === undefined) {
            return AuthImage.NOT_AUTH
        }
        if (imageSetting === false) {
            return AuthImage.DENY
        }
        if (imageSetting === true) {
            return AuthImage.AUTHORIZED
        }
    }

})