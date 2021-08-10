
import { promisic } from "../../utils/util";
import { User } from "../../models/user";

Component({

    properties: {
        fileCount: Number,
        trashCount: Number,
        code: {
            type: String,
            value: ''
        }
    },

    data: {
        showLoginBtn: false
    },

    lifetimes: {
        async attached() {
            let hasAuthorized = await this.hasAuthUserInfo()
            if (!hasAuthorized) {
                this.setData({
                    showLoginBtn: true
                })
                this.triggerEvent('nologin')
            }
        }
    },

    observers: {
        'showLoginBtn': function (showLoginBtn) {
            if (!showLoginBtn) {
                this.triggerEvent('codetap')
            }
        },
    },

    methods: {

        async onUpdateUserInfo(event) {
            let hasAuthorized = event.detail.errMsg
            if (hasAuthorized === "getUserInfo:ok") {
                let wxInfo = event.detail.userInfo
                const login = await wx.login({})
                if (login.code) {
                    let res = await User.updateUserInfo(wxInfo)
                    if (res.code === 0) {
                        this.setData({
                            showLoginBtn: false
                        })
                        this.triggerEvent('login')
                    }
                }
            }
        },

        async hasAuthUserInfo() {
            // const setting = await promisic(wx.getSetting)()
            const setting = await wx.getSetting()
            const userInfo = setting.authSetting['scope.userInfo']
            return !!userInfo;
        },

        onGotoMyFile(event) {
            wx.navigateTo({
                url: `/pages/my-file/my-file`
            })
        },

        onGotoTrash(event) {
            wx.navigateTo({
                url: `/pages/trash/trash`
            })
        }

        // 该方法由二次重发已经在数据库中写入用户信息（现已丢弃使用, 由onUpdateUserInfo代替只是修改用户的微信信息）
        // async onGetUserInfo(event) {
        //     let hasAuthorized = event.detail.errMsg
        //     if (hasAuthorized === "getUserInfo:ok") {
        //         let userInfo = event.detail.userInfo
        //         const login = await wx.login({})
        //         if (login.code) {
        //             const res = await wx.request({
        //                 url: 'http://localhost:8086/v1/token',
        //                 method: 'POST',
        //                 data: {
        //                     account: login.code,
        //                     type: 0,
        //                     user_info: userInfo
        //                 },
        //                 success: (res) => {
        //                     const code = res.statusCode.toString()
        //                     if (code.startsWith('2')) {
        //                         wx.setStorageSync('token', res.data.token)
        //                         this.setData({
        //                             showLoginBtn: false
        //                         })
        //                     }
        //                 }
        //             })
        //         }
        //     }
        // },
    }
})
