import { accDivider } from "../../utils/number";
import { getLineYMDHM } from "../../utils/date";

Component({

    properties: {
        item: Object,
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
        onItemTap() {
            let cid = this.properties.item.collect_id
            wx.navigateTo({
                url: `/pages/file-detail/file-detail?cid=${cid}`,
            })
        }
    }
})
