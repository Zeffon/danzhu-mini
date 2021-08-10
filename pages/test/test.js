Page({
  data: {
    uploadFileShow: false,
    categorys: [1, 2, 3]
  },

  onLoad() {

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
  
  onGetToken1() {
    // code
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: 'http://localhost:8086/v1/token',
            method: 'POST',
            data: {
              account: res.code,
              type: 0
            },
            success: (res) => {
              console.log(res.data)
              const code = res.statusCode.toString()
              if (code.startsWith('2')) {
                wx.setStorageSync('token', res.data.token)
              }
            }
          })
        }
      }
    })
  },

  async onGetToken() {
    const login = await wx.login({})
    if(login.code) {
      const info = await wx.getUserInfo({})
      const res = await wx.request({
        url: 'http://localhost:8086/v1/token',
        method: 'POST',
        data: {
          account: login.code,
          type: 0,
          user_info: JSON.stringify(info.userInfo)
        },
        success: (res) => {
          const code = res.statusCode.toString()
          if (code.startsWith('2')) {
            wx.setStorageSync('token', res.data.token)
          }
        }
      })
    }
  },

  onVerifyToken() {
    wx.request({
      url: 'http://localhost:8086/v1/token/verify',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res.data)
      }
    })
  },

  listJoinGroup() {
    wx.request({
      url: 'http://localhost:8086/v1/group/list/join',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  listCreateGroup() {
    wx.request({
      url: 'http://localhost:8086/v1/group/list/create',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  createGroup() {
    let remark =  [
      {key: "学号", value: ""},
      {key: "姓名", value: ""},
      {key: "班级", value: ""}
    ];
    wx.request({
      url: 'http://localhost:8086/v1/group/create',
      method: 'POST',
      data: {
        title: "王五",
        summary: "",
        oneself: 1,
        status: 1,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },
  
  getDetail() {
    wx.request({
      url: `http://localhost:8086/v1/group/detail/5`,
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },
  
  disbandGroup() {
    wx.request({
      url: 'http://localhost:8086/v1/group/disband',
      method: 'DELETE',
      data: {
        id: 4,
        code: "GAA0475687"
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  updateGroup() {
    let remark =  [
      {key: "学号", value: ""},
      {key: "班级", value: ""}
    ];
    wx.request({
      url: 'http://localhost:8086/v1/group/update',
      method: 'POST',
      data: {
        id: 5,
        title: "神秘人",
        summary: "神秘人的过往",
        oneself: 1,
        status: 1,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  adminGetDetail() {
    wx.request({
      url: `http://localhost:8086/v1/group/admin/detail/5`,
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  adminAddUser() {
    let remark =  [
      {key: "学号", value: "2020"},
      {key: "姓名", value: "诸神之战"},
      {key: "班级", value: "黄昏来临"}
    ];
    wx.request({
      url: `http://localhost:8086/v1/group/admin/add`,
      method: 'POST',
      data: {
        gid: 10,
        code: "UAA0451818"
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  adminModifyUser() {
    let remark =  [
      {key: "学号", value: "2020"},
      {key: "姓名", value: "诸神之战123"},
      {key: "班级", value: "黄昏来临123"}
    ];
    wx.request({
      url: `http://localhost:8086/v1/group/admin/update`,
      method: 'POST',
      data: {
        user_id: 43,
        group_id: 5,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  adminDeleteUser() {
    wx.request({
      url: `http://localhost:8086/v1/group/admin/delete`,
      method: 'DELETE',
      data: {
        id: 5,
        user_id: [13]
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  adminJoinGroup() {
    let remark =  [
      {key: "学号", value: "2020"},
      {key: "姓名", value: "诸神之战999"},
      {key: "班级", value: "黄昏来临999"}
    ];
    wx.request({
      url: `http://localhost:8086/v1/group/admin/join`,
      method: 'POST',
      data: {
        id: 10
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },
  
  adminQuitGroup() {
    wx.request({
      url: `http://localhost:8086/v1/group/admin/quit/10`,
      method: 'DELETE',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  addGroup() {
    let remark =  [
      {key: "学号", value: "2017"},
      {key: "姓名", value: "五三"},
      {key: "班级", value: "国防队"}
    ];
    wx.request({
      url: `http://localhost:8086/v1/group/user/add`,
      method: 'POST',
      data: {
        id: 5,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  quitGroup() {
    wx.request({
      url: `http://localhost:8086/v1/group/user/quit/5`,
      method: 'POST',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },
  
  userUpdateInfo() {
    let remark =  [
      {key: "学号", value: "2020"},
      {key: "姓名", value: "鬼谷子"},
      {key: "班级", value: "鬼谷"}
    ];
    wx.request({
      url: `http://localhost:8086/v1/group/user/update`,
      method: 'POST',
      data: {
        id: 5,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  listUser() {
    wx.request({
      url: `http://localhost:8086/v1/group/list/user?gid=5`,
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  listMyJoinCollect() {
    wx.request({
      url: 'http://localhost:8086/v1/collect/list/join',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  listMyCreateCollect() {
    wx.request({
      url: 'http://localhost:8086/v1/collect/list/create',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  createCollect() {
    let remark =  [
      {key: "学号", value: ""},
      {key: "姓名", value: ""},
      {key: "班级", value: ""}
    ];
    wx.request({
      url: 'http://localhost:8086/v1/collect/create',
      method: 'POST',
      data: {
        title: "高级架构实训作业",
        summary: "10周前收集完毕",
        status: 1,
        valid_period: 10,
        user_number: 50,
        file_number: 1,
        file_type: 0
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },
  
  getCollectDetail() {
    wx.request({
      url: `http://localhost:8086/v1/collect/detail/1`,
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },
  
  disbandCollect() {
    wx.request({
      url: 'http://localhost:8086/v1/collect/disband',
      method: 'DELETE',
      data: {
        id: 4,
        code: "GAA0475687"
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  updateCollect() {
    let remark =  [
      {key: "学号", value: ""},
      {key: "班级", value: ""}
    ];
    wx.request({
      url: 'http://localhost:8086/v1/collect/update',
      method: 'POST',
      data: {
        id: 5,
        title: "神秘人",
        summary: "神秘人的过往",
        oneself: 1,
        status: 1,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },
  
  adminAddUserInCollect() {
    let remark =  [
      {key: "学号", value: "2020"},
      {key: "姓名", value: "诸神之战"},
      {key: "班级", value: "黄昏来临"}
    ];
    wx.request({
      url: `http://localhost:8086/v1/collect/admin/add`,
      method: 'POST',
      data: {
        gid: 10,
        code: "UAA0451818"
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  adminUpdateUserInCollect() {
    let remark =  [
      {key: "学号", value: "2020"},
      {key: "姓名", value: "诸神之战123"},
      {key: "班级", value: "黄昏来临123"}
    ];
    wx.request({
      url: `http://localhost:8086/v1/collect/admin/update`,
      method: 'POST',
      data: {
        user_id: 43,
        group_id: 5,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  adminDeleteUserInCollect() {
    wx.request({
      url: `http://localhost:8086/v1/collect/admin/delete?groupId=${10}&ids=${[16]}`,
      method: 'DELETE',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  adminJoinCollect() {
    let remark =  [
      {key: "学号", value: "2020"},
      {key: "姓名", value: "诸神之战999"},
      {key: "班级", value: "黄昏来临999"}
    ];
    wx.request({
      url: `http://localhost:8086/v1/collect/admin/join`,
      method: 'POST',
      data: {
        id: 10
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },
  
  adminQuitCollect() {
    wx.request({
      url: `http://localhost:8086/v1/collect/admin/quit/10`,
      method: 'DELETE',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  userJoinCollect() {
    let remark =  [
      {key: "学号", value: "2017"},
      {key: "姓名", value: "五三"},
      {key: "班级", value: "国防队"}
    ];
    wx.request({
      url: `http://localhost:8086/v1/collect/user/add`,
      method: 'POST',
      data: {
        id: 5,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  userQuitCollect() {
    wx.request({
      url: `http://localhost:8086/v1/collect/user/quit/5`,
      method: 'POST',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },
  
  userUpdateCollectInfo() {
    let remark =  [
      {key: "学号", value: "2020"},
      {key: "姓名", value: "鬼谷子"},
      {key: "班级", value: "鬼谷"}
    ];
    wx.request({
      url: `http://localhost:8086/v1/collect/user/update`,
      method: 'POST',
      data: {
        id: 5,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  // 文件上传模块测试
  clickChoseFileType() {
    this.setData({
      uploadFileShow: true
    })
  },

  onGoto(event) {
    let category = event.detail.category
    wx.navigateTo({
      url: `/pages/file-category/file-category?category=${category}&count=${2}`
    })
  },


  userUploadFile() {
    this.setData({
      uploadFileShow: true
    })
    wx.request({
      url: `http://localhost:8086/v1/file/user/upload`,
      method: 'POST',
      data: {
        
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  userDeleteFile() {
    wx.request({
      url: `http://localhost:8086/v1/collect/user/update`,
      method: 'POST',
      data: {
        id: 5,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  userDownloadFile() {
    wx.request({
      url: `http://localhost:8086/v1/collect/user/update`,
      method: 'POST',
      data: {
        id: 5,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  listCollectFile() {
    wx.request({
      url: `http://localhost:8086/v1/collect/user/update`,
      method: 'POST',
      data: {
        id: 5,
        remark: remark
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  listCollectFile() {
    wx.request({
      url: `http://localhost:8086/v1/collect/list/user?gid=5`,
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },


  listMyJoinCollect() {
    wx.request({
      url: 'http://localhost:8086/v1/collect/list/join',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  listMyCreateCollect() {
    wx.request({
      url: 'http://localhost:8086/v1/collect/list/create',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },

  search() {
    wx.request({
      url: 'http://localhost:8086/v1/code/search/UAA0451818',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        'Authorization': this._getBearerToken()
      }
    })
  },
  
  _getBearerToken() {
    let token = wx.getStorageSync('token')
    let bearerToken = 'Bearer ' + token
    return bearerToken
  }
})