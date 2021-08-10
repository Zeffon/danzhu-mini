
import { Collect } from "../../models/collect";
import { getLineYMDHM } from "../../utils/date";
import { File } from "../../models/file";
import { Oss } from "../../models/oss";
import { linShowToast } from "../../utils/ui";

Page({

    data: {
        showDialog: false,
        isUpload: true,
        showCategory: false,
        showUploading: false,
        uploadCount: 0,
        isShared: false,
        isEnd: false,
        hasAuthorized: true
    },

    onLoad: async function (options) {
        let hasAuthorized = await this.hasAuthUserInfo()
        if (!hasAuthorized) {
            this.setData({
                hasAuthorized: false,
                showDialog: true
            })
        }
        let cid = options.cid
        this._initCollect(cid)
    },
    
    async onLogin() {
        let cid = this.data.collect.id
        await Collect.userAddCollect(cid)
        this.setData({
            hasAuthorized: true
        })
    },

    onShowCategory() {
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
        let cid = this.data.collect.id
        let res = await wx.chooseImage({
            count: 3,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
        })
        if (res.errMsg === "chooseImage:ok") {
            let files = res.tempFiles
            const oss = await Oss.getPolicy()
            for (let index = 0; index < files.length; index++) {
                let uploadTask = await Oss.uploadImage(files[index], index, oss, cid)
                if(uploadTask === '') {
                    linShowToast('error', '图片格式不正确，请重新选择')
                    return
                }
                this._uploadTask(uploadTask, files, index)
            }
        }
    },

    async onSelectFile() {
        let cid = this.data.collect.id
        const res = await wx.chooseMessageFile({
            count: 3,
            type: 'image, file'
        })
        if (res.errMsg === "chooseMessageFile:ok") {
            let files = res.tempFiles
            const oss = await Oss.getPolicy()
            for (let index = 0; index < files.length; index++) {
                let uploadTask = await Oss.uploadFile(files[index], index, oss, cid)
                console.log(uploadTask)
                this._uploadTask(uploadTask, files, index)
            }
        }
    },

    onOpenUpload() {
        this.setData({
            isUpload: true
        })
    },

    async hasAuthUserInfo() {
        const setting = await wx.getSetting()
        const userInfo = setting.authSetting['scope.userInfo']
        return !!userInfo;
    },

    _uploadTask(uploadTask, files, index) {
        uploadTask.onProgressUpdate((res) => {
            this.setData({
                showCategory: false,
                showUploading: true,
                percent: res.progress,
                uploadCount: files.length
            })
        })
        if (index === files.length - 1) {
            uploadTask.onProgressUpdate((res) => {
                if (res.progress === 100) {
                    this.setData({
                        percent: 0,
                        uploadCount: 0,
                        showUploading: false,
                        isUpload: false
                    })
                }
            })
        }
    },

    async _uploadFile(cid, title, url, size) {
        await File.uploadFile(cid, title, url, size)
    },

    async _initCollect(cid) {
        let collect = await Collect.getDetail(cid)
        if (!collect) {
            return
        }
        let timestamp = new Date().getTime()
        if(timestamp > collect.end_time) {
            this.setData({
                isEnd: true
            })
            return
        }
        collect.end_time = getLineYMDHM(collect.end_time)
        this.setData({
            collect
        })
    },

})