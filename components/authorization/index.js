import { User } from "../../models/user";

Component({

    properties: {

    },

    data: {

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
    }
})
