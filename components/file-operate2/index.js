import { linShowToast } from "../../utils/ui.js";
import { AuthImage } from "../../core/enum";

Component({

    properties: {
        show: {
            type: Boolean,
            value: false
        },
        file: Object,
    },

    data: {
        showImageDialog: false
    },

    methods: {
        onCancel() {
            this.triggerEvent('cancel')
        },


        async onDownloadFile() {
            let ext = this._checkFileType()
            if (ext === '.PNG' || ext === '.JPG' || ext === '.JPEG' || ext === '.GIF') {
                const authStatus = await this.hasAuthorizedSaveImage()
                if (authStatus === AuthImage.DENY) {
                    this.setData({
                        showImageDialog: true
                    })
                    return
                }
                this._downloadImage()
            } else {
                let file = this.properties.file
                wx.showLoading({
                    title: '加载中...',
                })
                wx.downloadFile({
                    url: file.url,
                    success: res => {
                        const filePath = res.tempFilePath
                        wx.openDocument({
                            filePath,
                            showMenu: true,
                            success: res => {
                                wx.hideLoading();
                            },
                            fail: res => {
                                console.error(res)
                                wx.hideLoading();
                            }
                        })
                    }
                })
            }
        },

        onImageDialogConfirm() {
            wx.openSetting()
        },

        _downloadImage() {
            let file = this.properties.file
            const downloadTask = wx.downloadFile({
                url: file.url,
                success: res => {
                    const filePath = res.tempFilePath
                    wx.saveImageToPhotosAlbum({
                        filePath,
                        fail: res => {
                            console.error(res)
                        }
                    })
                }
            })
            this.setData({
                showDownloading: true
            })
            downloadTask.onProgressUpdate((res) => {
                this.setData({
                    percent: res.progress
                })
                if (res.progress === 100) {
                    linShowToast('success', '下载成功')
                    this.setData({
                        showDownloading: false,
                        percent: 0
                    })
                    this.triggerEvent('cancel')
                }
            })
        },

        _checkFileType() {
            let filename = this.properties.file.title
            let index = filename.lastIndexOf(".")
            let ext = filename.substr(index)
            return ext.toUpperCase()
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

    }
})
