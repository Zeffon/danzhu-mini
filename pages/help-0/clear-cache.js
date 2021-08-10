import { linShowToast } from "../../utils/ui";
import { User } from "../../models/user";

Page({

    data: {

    },

    onLoad: function (options) {

    },

    async onClearCache(event) {
        wx.clearStorage()
        linShowToast('success', '清除成功')
        let wxInfo = event.detail.userInfo
        const login = await wx.login({})
        if (login.code) {
            await User.updateUserInfo(wxInfo)
        }
    },

})