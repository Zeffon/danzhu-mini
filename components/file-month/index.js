
Component({

    properties: {
        months: Array,
        items: Object
    },

    data: {

    },

    methods: {
        onPageScroll(event) {
            console.log(event)
            this.setData({
                scrollTop: event.scrollTop
            });
        },

        onTapAvatar(event) {
            let url = event.currentTarget.dataset.url
            wx.previewImage({
                urls: [url]
            });
        },
    }
})
