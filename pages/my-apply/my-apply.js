import { GroupApplyStatus } from "../../core/enum";
import { Group } from "../../models/group"

Page({

  data: {
    activeKey: GroupApplyStatus.ALL,
    items: [],
    loadingType: 'loading',
    bottomLoading: true,
    paging: null,
    isEmpty: false
  },

  onLoad: async function (options) {
    const activeKey = options.key
    this.data.activeKey = options.key
    this._initItems(activeKey)
  },

  onShow: function () {
    this._initItems(this.data.activeKey)
  },

  async _initItems(activeKey) {

    this.setData({
      activeKey,
      items: []
    })
    this.data.paging = this.getPaging(activeKey)
    const data = await this.data.paging.getMoreData()
    if (!data) {
      return
    }
    this._bindItems(data)
  },

  getPaging(activeKey) {
    activeKey = parseInt(activeKey)
    switch (activeKey) {
      case GroupApplyStatus.ALL:
        return Group.getPagingByStatus(GroupApplyStatus.ALL)
      case GroupApplyStatus.WAITING:
        return Group.getPagingByStatus(GroupApplyStatus.WAITING)
      case GroupApplyStatus.PASSED:
        return Group.getPagingByStatus(GroupApplyStatus.PASSED)
      case GroupApplyStatus.REFUSED:
        return Group.getPagingByStatus(GroupApplyStatus.REFUSED)
    }
  },

  empty() {
    this.setData({
      isEmpty: true,
      bottomLoading: false
    })
  },

  _bindItems(data) {
    if (data.empty) {
      this.empty()
      return
    }
    if (data.accumulator.length !== 0) {
      this.setData({
        items: data.accumulator,
        isEmpty: false,
        bottomLoading: true
      });
    }
    if (!data.moreData) {
      this.setData({
        loadingType: 'end'
      })
    }
  },

  onSegmentChange(event) {
    const activeKey = event.detail.activeKey
    this._initItems(activeKey)
  },

  async onReachBottom() {
    const data = await this.data.paging.getMoreData()
    if(!data) {
      return
    }
    this._bindItems(data)
  },

})