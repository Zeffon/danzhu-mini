import { accDivider } from "../../utils/number";
import { getLineYMDHM } from "../../utils/date";

Component({

    properties: {
        item: Object,
        isEllipsis: {
            type: Boolean,
            value: true
        },
    },

    observers: {
        'item': function (item) {
            if (!item) {
                return
            }
            let create_time = getLineYMDHM(item.create_time)
            let size = ''
            if (item.size > 1024) {
                size = Math.round(item.size / 1024) + 'kb'
            }
            if (item.size > 1048576) {
                size = accDivider(item.size, 1024 * 1024).toFixed(1) + 'M'
            }
            this.setData({
                create_time,
                size
            })
        }
    },

    data: {
        ext: ''
    },

    methods: {

        onEllipsis() {
            this.triggerEvent('itemtap', {
                item: this.properties.item
            }, { bubbles: true, composed: true })
        },

        onPreviewImage() {
            wx.previewImage({
                urls: [this.properties.item.url] // 需要预览的图片http链接列表
            })
        },

        onTapAvatar(event) {
            let url = event.currentTarget.dataset.url
            wx.previewImage({
                urls: [url]
            });
        },

        onPreviewFile() {
            let file = this.properties.item
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
                        }
                    })
                }
            })
        }
    }
})
