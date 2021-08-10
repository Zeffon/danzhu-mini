// pages/home/home.js
Page({

  data: {

  },

  onLoad: function (options) {

  },


  onGotoSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  async onGetUserInfo(event) {
    let hasAuthorized = event.detail.errMsg
    if (hasAuthorized === "getUserInfo:ok") {
      let userInfo = event.detail.userInfo
      const login = await wx.login({})
      if (login.code) {
        const res = await wx.request({
          url: 'http://localhost:8086/v1/token',
          method: 'POST',
          data: {
            account: login.code,
            type: 0,
            user_info: userInfo
          },
          success: (res) => {
            const code = res.statusCode.toString()
            if (code.startsWith('2')) {
              wx.setStorageSync('token', res.data.token)
            }
          }
        })
      }
    }
  },

  onCreateGroup() {
    wx.navigateTo({
      url: '/pages/group-create/group-create',
    })
  },

  onCreateCollect() {
    wx.navigateTo({
      url: '/pages/collect-create/collect-create',
    })
  },


  onShow: function () {

  },

})