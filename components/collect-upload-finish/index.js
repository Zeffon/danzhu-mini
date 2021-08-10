
Component({

    properties: {
		collect: Object
    },

    data: {

    },

    methods: {
        onAgainUpload() {
            this.triggerEvent('upload')
        },

        onGotoCollect() {
            wx.switchTab({
              url: '/pages/collect/collect',
            })
        }
    }
})
