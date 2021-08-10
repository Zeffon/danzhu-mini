import { getLineYMDHM } from "../../utils/date";
import { linShowToast } from "../../utils/ui";

Component({

    properties: {
        show: {
            type: Boolean,
            value: false
        },
        isCreate: {
            type: Boolean,
            value: true
        },
        link: Object
    },

    observers: {
        'link': function (link) {
            if (!link) {
                return
            }
            let end_time;
            if (link.end_time !== null) {
                end_time = getLineYMDHM(link.end_time)
            } else {
                end_time = '永久有效'
            }
            this.setData({
                end_time
            })
        }
    },

    data: {
        status: 7,
        codeStatus: 0,
        code: ''
    },

    methods: {
        onCancel() {
            this.setData({
                status: 7,
                codeStatus: 0,
                code: ''
            })
            this.triggerEvent('cancel')
        },

        onCreateLink() {
            let status = this.data.status
            let codeStatus = this.data.codeStatus
            let code = this.data.code
            if(codeStatus === "1" && code === '') {
                linShowToast('error', '提取码不能为空', 1000)
                return
            }
            if(codeStatus === "1" && code.length !== 4) {
                linShowToast('error', '提取码长度不正确', 1000)
                return
            }
            this.triggerEvent('create', { status, code })
        },

        onChangeStatus(event) {
            let status = event.detail.key
            this.setData({
                status
            })
        },

        onChangeStatus2(event) {
            let codeStatus = event.detail.key
            this.setData({
                codeStatus
            })
        },

        onCopyLink() {
            let link = this.properties.link
            let data = `链接：${link.url}\n` +
                `提取码：${link.password}`
            wx.setClipboardData({
                data,
            })
        },

        onInput(event) {
            let code = event.detail.value
            this.data.code = code
        },
    }
})
