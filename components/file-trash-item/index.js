import { accSubtract, accDivider } from "../../utils/number";

Component({

    properties: {
        item: Object
    },

    observers: {
        'item': function (item) {
            if (!item) {
                return
            }
            const date = new Date()
            let delete_time = item.delete_time + 7 * 24 * 60 * 60 * 1000 - date.getTime()
            let period = accDivider(delete_time, 1000)
            this.setData({
                period
            })
        }
    },

    data: {

    },

    methods: {
        onEllipsis() {
            this.triggerEvent('itemtap', {
                item: this.properties.item
            }, { bubbles: true, composed: true })
        },
    }
})
