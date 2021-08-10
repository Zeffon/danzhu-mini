import { File } from "../../models/file";
import { Oss } from "../../models/oss";
import { linShowToast } from "../../utils/ui";
import { getLineYMD } from "../../utils/date";
import { FileCategory } from "../../core/enum";

Page({

    data: {
        showCategory: false,
        showUploading: false,
        uploadCount: 0,
        showOperate: false
    },

    async onLoad(options) {
        let cid = options.cid
        wx.lin.showLoading({
            color: '#09AAFF',
            type: 'flash',
            fullScreen: true
        })
        this._initData(cid)
        wx.lin.hideLoading()
    },

    onItemTap(event) {
        let file = event.detail.item
        this.setData({
            file,
            showOperate: true
        })
    },

    onCloseOperate() {
        this.setData({
            showOperate: false
        })
    },

    onOpenCategory() {
        this.setData({
            showCategory: true
        })
    },

    onCloseCategory() {
        this.setData({
            showCategory: false
        })
    },


    async onSelectImage() {
        let res = await wx.chooseImage({
            count: 3,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
        })
        if (res.errMsg === "chooseImage:ok") {
            let files = res.tempFiles
            this.setData({
                showUploading: true,
                uploadCount: files.length
            })
            const oss = await Oss.getPolicy()
            for (let index = 0; index < files.length; index++) {
                let i = files[index].path.lastIndexOf(".")
                let ext = files[index].path.substr(i)
                let extTemp = ext.toUpperCase()
                if (extTemp !== '.PNG' && extTemp !== '.JPG' && extTemp !== '.JPEG' && extTemp !== '.GIF') {
                    linShowToast('error', '图片格式不正确，请重新选择')
                    return
                }
                const date = new Date
                let timestamp = date.getTime().toString().substr(7);
                let filename = getLineYMD(date) + " " + timestamp + " " + (index + 1) + ext
                let key = oss.dir + filename
                const uploadTask = wx.uploadFile({
                    url: oss.host,
                    filePath: files[index].path,
                    name: 'file',
                    formData: {
                        "OSSAccessKeyId": oss.access_key_id,
                        "policy": oss.policy,
                        "Signature": oss.signature,
                        "key": key,
                        "success_action_status": '201'
                    },
                    success: res => {
                        let cid = this.data.cid
                        let title = filename
                        let url = oss.host + "/" + key
                        let size = files[index].size
                        let refresh = index === files.length - 1 ? true : false
                        this._uploadFile(cid, title, url, size, FileCategory.IMAGE, refresh)
                    }
                })
                this._uploadTask(uploadTask, files, index)
            }
        }
    },

    async onSelectFile() {
        let cid = this.data.cid
        const res = await wx.chooseMessageFile({
            count: 3,
            type: 'image, file'
        })
        if (res.errMsg === "chooseMessageFile:ok") {
            let files = res.tempFiles
            this.setData({
                showUploading: true,
                uploadCount: files.length
            })
            const oss = await Oss.getPolicy()
            for (let index = 0; index < files.length; index++) {
                let filename = files[index].name
                let key = oss.dir + filename
                const uploadTask = wx.uploadFile({
                    url: oss.host, // 开发者服务器的URL。
                    filePath: files[index].path,
                    name: 'file', // 必须填file。
                    formData: {
                        "OSSAccessKeyId": oss.access_key_id,
                        "policy": oss.policy,
                        "Signature": oss.signature,
                        "key": key,
                        "success_action_status": '201'
                    },
                    success: res => {
                        let title = filename
                        let url = oss.host + "/" + key
                        let size = files[index].size
                        let i = filename.lastIndexOf(".")
                        let ext = filename.substr(i)
                        let extTemp = ext.toUpperCase()
                        let refresh = index === files.length - 1 ? true : false
                        if (extTemp === '.PNG' || extTemp === '.JPG' || extTemp === '.JPEG' || extTemp === '.GIF') {
                            this._uploadFile(cid, title, url, size, FileCategory.IMAGE, refresh)
                        } else {
                            this._uploadFile(cid, title, url, size, FileCategory.FILE, refresh)
                        }
                    }
                })
                this._uploadTask(uploadTask, files, index)
            }
        }
    },

    async onSetOnline(event) {
        let file = event.detail.file
        let online = !file.online
        let res = await File.setOnline(file.id, online)
        if (res.code === 0) {
            linShowToast('success', '修改成功', 1500)
            let detail = this.data.detail
            detail.files.forEach(item => {
                if (item.id === file.id) {
                    item.online = online
                }
            })
            this.setData({
                detail,
                showOperate: false
            })
        }
    },

    onDeleteFile(event) {
        let file = event.detail.file
        wx.lin.showDialog({
            type: "confirm",
            title: `是否删除所选择的文件？`,
            success: (res) => {
                if (res.confirm) {
                    this._deleteFile(file.id)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    _uploadTask(uploadTask, files, index) {
        uploadTask.onProgressUpdate((res) => {
            this.setData({
                percent: res.progress
            })
        })
        if (index === files.length - 1) {
            uploadTask.onProgressUpdate((res) => {
                if (res.progress === 100) {
                    this.setData({
                        showUploading: false,
                        showCategory: false,
                        percent: 0,
                        uploadCount: 0
                    })
                    linShowToast('success', '上传成功')
                }
            })
        }
    },

    async _deleteFile(fid) {
        let res = await File.adminDeleteFile(fid)
        if (res.code === 0) {
            linShowToast('success', '删除成功')
            let cid = this.data.cid
            this._initData(cid)
            this.setData({
                showOperate: false
            })
        }
    },

    async _uploadFile(cid, title, url, size, category, refresh = false) {
        let res = await File.uploadFile(cid, title, url, size, category)
        if (res.code === 0 && refresh) {
            this._initData(cid)
        }
    },

    async _initData(cid) {
        const detail = await File.listFileByCid(cid)
        this.setData({
            detail,
            cid
        })
    }

})