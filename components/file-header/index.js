// components/file-header/index.js
Component({

    properties: {
        detail: Object,
        isAdmin: {
            type: Boolean,
            value: false
        }
    },

    observers: {
        'detail': function (detail) {
            let isAdmin = this.properties.isAdmin
            if (!detail || isAdmin) {
                return
            }
            let cur = new Date().getTime()
            if (detail.endTime < cur) {
                this.setData({
                    stopUpload: true
                })
            }
        }
    },

    data: {
        stopUpload: false
    },

    methods: {
        onClick() {
            this.triggerEvent('clicktap')
        },

        onGotoFileShare() {
            let uid = this.properties.detail.uid
            console.log(uid)
            wx.navigateTo({
              url: `/pages/file-share/file-share?uid=${uid}`,
            })
        }
    }
})
