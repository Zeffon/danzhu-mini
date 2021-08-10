
import { File } from "../../models/file";
import { linShowToast } from "../../utils/ui";

Page({

    data: {
        showPopup: false
    },

    onLoad: function (options) {
        this._initData()
    },


    onOpenPopup(event) {
        let file = event.detail.item
        this.setData({
            file,
            showPopup: true
        })
    },

    onClosePopup() {
        this.setData({
            showPopup: false
        })
    },

    onRestoreFile() {
        let file = this.data.file
        wx.lin.showDialog({
            type: "confirm",
            title: "是否将文件恢复到原处？",
            success: (res) => {
                if (res.confirm) {
                    this._restoreFile(file.id)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    onDeleteFile() {
        let file = this.data.file
        wx.lin.showDialog({
            type: "confirm",
            title: "一旦粉碎将无法找回该文件？",
            success: (res) => {
                if (res.confirm) {
                    this._deleteFile(file.id)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    async _initData() {
        const items = await File.listTrashFile()
        this.setData({
            items
        })
    },

    async _restoreFile(id) {
        let res = await File.restoreFile(id)
        if(res.code === 0) {
            linShowToast('success', '文件已放回原处')
            this._initData()
            this.onClosePopup()
        }
    },

    async _deleteFile(id) {
        let res = await File.realDelete(id)
        if(res.code === 0) {
            linShowToast('success', '删除成功')
            this._initData()
            this.onClosePopup()
        }
    }
})