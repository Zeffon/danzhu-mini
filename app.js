import { Token } from "./models/token";

App({
    async onLaunch() {
        if (!await this.hasAuthUserInfo()) {
            console.log('要登陆')
            this.globalData.showLoginBtn = true
        }
        const token = new Token()
        token.verify()
    },

    async hasAuthUserInfo() {
        const setting = await wx.getSetting()
        console.log(setting)
        const userInfo = setting.authSetting['scope.userInfo']
        return !!userInfo;
    },

    globalData: {
        showLoginBtn: false,
        userInfo: null
    }
})