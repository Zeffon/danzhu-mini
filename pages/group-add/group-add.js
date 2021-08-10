import { Group } from "../../models/group";
import { linShowToast } from "../../utils/ui";

Page({

    data: {
        showDialog: false,
        hasAuthorized: true
    },

    onLoad: async function (options) {
        let hasAuthorized = await this.hasAuthUserInfo()
        if (!hasAuthorized) {
            this.setData({
                hasAuthorized: false,
                showDialog: true
            })
        }
        let gid = options.gid
        this._initGroup(gid)
    },

    async onJoinGroup(event) {
        let group = this.data.group
        let gid = group.id
        let status = group.status
        if (status === 2) {
            linShowToast('error', '当前用户组不允许用户加入')
            return
        }
        let res = await Group.userAddGroup(gid)
        if (res.code === 0) {
            if (status === 0) {
                linShowToast('success', '加入成功', 800)
                wx.navigateTo({
                    url: `/pages/group-detail/group-detail?gid=${gid}`,
                })
            }
            if (status === 1) {
                linShowToast('success', '已提交申请，等待管理员审核')
            }
        }
    },

    onLogin() {
        this.setData({
            hasAuthorized: true
        })
    },

    async hasAuthUserInfo() {
        const setting = await wx.getSetting()
        const userInfo = setting.authSetting['scope.userInfo']
        return !!userInfo;
    },
    
    async _initGroup(gid) {
        let group = await Group.getDetail(gid)
        if (!group) {
            return
        }
        this.setData({
            group
        })
    },

})