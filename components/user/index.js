// components/user/index.js
Component({

    properties: {
        user: Object
    },

    data: {

    },

    methods: {
        onShareFiles() {
            let uid = this.properties.user.id
            wx.navigateTo({
                url: `/pages/file-share/file-share?uid=${uid}`,
            })
        },
    }
})
