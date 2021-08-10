
Page({

    data: {
        cid: ''
    },

    onLoad: function (options) {
        let cid = options.cid
        this.setData({
            cid
        })
    },

    onStatisticsDetail(event) {
        let cid = this.data.cid
        let category = event.currentTarget.dataset.category
        wx.navigateTo({
          url: `/pages/collect-statistics-detail/index?cid=${cid}&category=${category}`,
        })
    },

})