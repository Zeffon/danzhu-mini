import { Group } from "../../models/group";
import { Permission } from "../../models/permission";

Page({

    data: {
        shareBtn: false
    },

    onLoad: function (options) {
        let gid = options.gid
        if(options.scene !== undefined) {
            gid = decodeURIComponent(options.scene)
        }
        this._initGroup(gid)
    },

    async _initGroup(gid) {
        let group = await Group.getDetail(gid)
        let shareBtn = await Permission.getShareBtn()
        if (!group) {
            return
        }
        this.setData({
            group,
            shareBtn
        })
    },

    onShareAppMessage: function () {
        let gid = this.data.group.id
        let title = this.data.group.title
        return {
            title: `邀请你加入 ${title}`,
            path: `/pages/group-add/group-add?gid=${gid}`
        }
    },

    onGotoWxa() {
        let gid = this.data.group.id
        let page = `pages/group-add/group-add`
        wx.navigateTo({
            url: `/pages/wxa/wxa?gid=${gid}&page=${page}&width=200`,
        })
    }
})