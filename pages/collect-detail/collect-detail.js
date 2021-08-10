
import { Collect } from "../../models/collect";
import { Link } from "../../models/link";
import { linShowToast } from "../../utils/ui";
import { File } from "../../models/file";
import { Oss } from "../../models/oss";
import { getLineYMD } from "../../utils/date";
import { FileCategory } from "../../core/enum";
import { getWindowHeightRpx } from "../../utils/system";

Page({
    data: {
        userPaging: null,
        isEmpty: false,
        loadingType: 'loading',
        bottomLoading: true,
        items: Array,
        morePopup: false,
        codePopup: false,
        isCreate: true,
        link: Object,
        showCategory: false,
        showUploading: false
    },

    onLoad: async function (options) {
        let cid = options.cid
        const windowHeight = await getWindowHeightRpx()
        const h = windowHeight - 100
        this.setData({
            cid,
            h
        })
        this._initData(cid)
    },

    async onCreateLink(event) {
        let status = event.detail.status
        let code = event.detail.code
        let cid = this.data.cid
        wx.showLoading({
            title: '正在创建链接中...',
        })
        let link = await Link.createLink(cid, status, code)
        this._copyLink(link)
        wx.hideLoading({})
        this.setData({
            link,
            isCreate: false
        })
    },

    onOpenMorePopup() {
        this.setData({
            morePopup: true
        })
    },

    onCloseMorePopup() {
        this.setData({
            morePopup: false
        })
    },

    onOpenCodePopup() {
        this.setData({
            codePopup: true
        })
    },

    onCloseCodePopup() {
        this.setData({
            codePopup: false,
            isCreate: true
        })
    },

    onOpenCategory() {
        this.setData({
            morePopup: false,
            showCategory: true
        })
    },

    onCloseCategory() {
        this.setData({
            showCategory: false
        })
    },

    onGotoEdit() {
        let cid = this.data.cid
        wx.navigateTo({
            url: `/pages/collect-edit/collect-edit?cid=${cid}`,
        })
    },

    onGotoGet() {
        let cid = this.data.cid
        wx.navigateTo({
            url: `/pages/collect-statistics/collect-statistics?cid=${cid}`,
        })
    },

    onDeleteUser(event) {
        let user = event.detail.user
        wx.lin.showDialog({
            type: "confirm",
            title: `是否删除所选择的用户？`,
            success: (res) => {
                if (res.confirm) {
                    this._deleteUser(user.uid, user.cid)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    async onScrollTolower() {
        const data = await this.data.userPaging.getMoreData()
        if (!data) {
            return
        }
        this._bindData(data)
    },

    onGotoShare() {
        let cid = this.data.cid
        wx.navigateTo({
          url: `/pages/collect-share/collect-share?cid=${cid}`,
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
                showUploading: true
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
                showUploading: true
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

    async _deleteUser(uid, cid) {
        let res = await Collect.deleteUser(uid, cid)
        if (res.code === 0) {
            this._initData(cid)
            linShowToast('success', '删除成功')
        }
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
                    })
                    linShowToast('success', '上传成功')
                }
            })
        }
    },

    async _uploadFile(cid, title, url, size, category, refresh = false) {
        let res = await File.uploadFile(cid, title, url, size, category)
        if (res.code === 0 && refresh) {
            this._initData(cid)
        }
    },


    _copyLink(link) {
        let data = `链接：${link.url}\n` +
            `提取码：${link.password}`
        wx.setClipboardData({
            data
        })
    },

    async _initData(cid) {
        const paging = Collect.listUserCollect(cid)
        this.data.userPaging = paging
        const userData = await paging.getMoreData()
        this._bindData(userData)
    },

    _bindData(data) {
        if (data.empty) {
            this.setData({
                isEmpty: true,
                bottomLoading: false
            })
            return
        }
        if (data.accumulator.length !== 0) {
            this.setData({
                items: data.accumulator,
                bottomLoading: true
            })
        }
        if (!data.moreData) {
            this.setData({
                loadingType: 'end'
            })
        }
    },
})