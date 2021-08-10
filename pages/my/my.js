import { User } from "../../models/user";
import { File } from "../../models/file";

Page({

    data: {
        showLoginBtn: false,
        showDialog: false,
        hasGetData: false,
        fileCount: 0,
        code: ''
    },

    async onLoad(options) {
        const count = await File.countFile()
        this.setData({
            fileCount: count.file_count,
            trashCount: count.trash_count
        })
        this.onGetUserCode()
    },

    onShow: function () {

    },

    onShowDialog() {
        this.setData({
            showDialog: true
        })
    },

    onHasAuthorized() {
        this.setData({
            hasGetData: true
        })
    },

    async onGetUserCode() {
        const user = await User.getCode()
        if (user.code === 10004) { // 401 未授权
            return
        }
        this.setData({
            code: user.code
        })
    },

    onGotoHelpAndFellback() {
        wx.navigateTo({
            url: `/pages/help/help`
        })
    },

    onGotoFileShare() {
        wx.navigateTo({
          url: `/pages/file-share/file-share`,
        })
    }
})