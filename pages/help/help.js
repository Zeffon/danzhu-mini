
Page({

    data: {

    },

    onLoad: function (options) {

    },

    onGotoDemo1() {
        wx.navigateTo({
            url: `/pages/help-1/demo`,
        })
    },

    onGotoDemo2() {
        wx.navigateTo({
            url: `/pages/help-2/demo`,
        })
    },

    onGotoDemo3() {
        wx.navigateTo({
            url: `/pages/help-3/demo`,
        })
    },

    onGotoDemo4() {
        wx.navigateTo({
            url: `/pages/help-4/demo`,
        })
    },

    onGotoDemo5() {
        wx.navigateTo({
            url: `/pages/help-5/demo`,
        })
    },

    onGotoClearCache() {
        wx.navigateTo({
            url: `/pages/help-0/clear-cache`,
        })
    }
})