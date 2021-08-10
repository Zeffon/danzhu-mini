import { getLineYMDHM } from "../../utils/date";

Component({

    properties: {
        item: Object
    },

    observers: {
        'item': function (item) {
            if (!item) {
                return
            }
            let create_time = getLineYMDHM(item.create_time)
            this.setData({
                create_time
            })
        }
    },

    data: {

    },

    methods: {
        onDelete() {
            this.triggerEvent('deletetap', {
                user: this.properties.item
            }, { bubbles: true, composed: true })
        },
        onGotoUploadFile() {
            let uid = this.properties.item.uid
            let cid = this.properties.item.cid
            wx.navigateTo({
                url: `/pages/file-upload/file-upload?uid=${uid}&cid=${cid}`,
            })
        }
    }
})
