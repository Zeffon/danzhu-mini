
import { Group } from "../../models/group";
import { getWindowHeightRpx } from "../../utils/system";
import { linShowToast } from "../../utils/ui";
import { GroupList } from "../../core/enum"

Page({

  data: {
    activeKey: GroupList.CREATE,
    loadingType1: 'loading',
    bottomLoading1: true,
    loadingType1: 'loading',
    bottomLoading2: true,
    createPaging: null,
    joinPaging: null,
    createList: [],
    joinList: [],
    isEmpty1: false,
    isEmpty2: false,
    deleteDialog: false,
    deleteId: ''
  },

  async onLoad(options) {
    const windowHeight = await getWindowHeightRpx()
    const h1 = windowHeight
    const h2 = windowHeight - 80

    this.setData({
      h1,
      h2,
    })
  },

  onShow() {
    this._initCreateData()
    this._initJoinData()
  },

  onGotoAdd() {
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },

  onGotoSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  onTabpanelChange(event) {
    let activeKey = event.detail.activeKey
    this.setData({
      activeKey
    })
    if (activeKey === GroupList.CREATE) {
      this._initCreateData()
    } else {
      this._initJoinData()
    }
  },

  onQuitGroup(event) {
    let gid = event.detail.gid
    this.setData({
      deleteId: gid,
      deleteDialog: true
    })
  },

  onConfirmDelete(event) {
    console.log(event)
    let gid = event.currentTarget.dataset.gid
    this._userConfirmQuit(gid)
  },

  async _initCreateData() {
    const paging1 = Group.listCreate()
    this.data.createPaging = paging1
    const createData = await paging1.getMoreData()
    this._bindCreateData(createData)
  },

  async _initJoinData() {
    const paging2 = Group.listJoin()
    this.data.joinPaging = paging2
    const joinData = await paging2.getMoreData()
    this._bindJoinData(joinData)
  },

  _bindCreateData(data) {
    if (data.empty) {
      this._empty1()
      return
    }
    if (data.accumulator.length !== 0) {
      this.setData({
        createList: data.accumulator,
        bottomLoading1: true,
        isEmpty1: false
      })
    }
    if (!data.moreData) {
      this.setData({
        loadingType1: 'end'
      })
    }
  },

  _bindJoinData(data) {
    if (data.empty) {
      this._empty2()
      return
    }
    if (data.accumulator.length !== 0) {
      this.setData({
        joinList: data.accumulator,
        bottomLoading2: true,
        isEmpty2: false
      })
    }
    if (!data.moreData) {
      this.setData({
        loadingType2: 'end'
      })
    }
  },

  _empty1() {
    this.setData({
      isEmpty1: true,
      bottomLoading1: false
    })
  },

  _empty2() {
    this.setData({
      isEmpty2: true,
      bottomLoading2: false
    })
  },

  async _userConfirmQuit(gid) {
    const res = await Group.userQuitGroup(gid)
    if (res.code === 0) {
      linShowToast('success', '退出成功')
      setTimeout(() => {
        this._initJoinData()
      }, 800)
    }
  },

  async onReachBottom() {
    let activeKey = this.data.activeKey
    if (activeKey === GroupList.CREATE) {
      const data = await this.data.createPaging.getMoreData()
      if (!data) {
        return
      }
      this._bindCreateData(data)
    } else {
      const data = await this.data.joinPaging.getMoreData()
      if (!data) {
        return
      }
      this._bindJoinData(data)
    }
  },
})