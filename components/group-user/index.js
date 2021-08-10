
Component({

    properties: {
        user: Object,
        isEllipsis: {
            type: Boolean,
            value: false
        },
        showCheck: {
            type: Boolean,
            value: false
        }
    },

    data: {

    },

    methods: {
        onEllipsis() {
            this.triggerEvent('ellipsistap', {
                user: this.properties.user
            }, { bubbles: true, composed: true })
        },

        onCheckItem(event) {
            let user = this.properties.user
            let checked = event.detail.checked
            user.checked = checked
            this.triggerEvent('checkitem', { user, checked }, { bubbles: true, composed: true })
        },

        onGotoFileShare() {
            let uid = this.properties.user.uid
            console.log(uid)
            wx.navigateTo({
              url: `/pages/file-share/file-share?uid=${uid}`,
            })
        }
    }
})
