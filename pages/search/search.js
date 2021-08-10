// pages/search/search.js
import { HistoryKeyword } from "../../models/history-keyword";
import {Search} from "../../models/search"

const history = new HistoryKeyword()
Page({

  data: {
    hasData: false,
    searchType: ''
  },

  onLoad: async function (options) {
    const historyTags = history.get()
    const hotTags = await Search.getHotWord()
    this.setData({
      historyTags,
      hotTags
    })
  },

  async onSearch(event) {
    this.setData({
      search: true,
      items: []
    })
    const keyword = event.detail.value || event.detail.name
    if (!keyword) {
      showToast('请输入搜索的关键字')
      return
    }
    history.save(keyword)
    this.setData({
      historyTags: history.get()
    })

    wx.lin.showLoading({
      color: '#09AAFF',
      type: 'flash',
      fullScreen: true
    })
    const searchType = keyword.substring(0, 1)
    const data = await Search.search(keyword)
    setTimeout(() => {
      wx.lin.hideLoading()
    },200)

    this._bindItems(data, searchType)
  },

  onCancel(event) {
    this.setData({
      search: false
    })
  },

  onDeleteHistory(event) {
    history.clear()
    this.setData({
      historyTags: []
    })
  },
  
  _bindItems(data, searchType) {
    if (data === null || data.length === 0) {
      this.setData({
        searchType,
        hasData: false
      })
    } else {
      this.setData({
        searchType,
        hasData: true,
        searchData: data
      })
    }
  },

  onShow: function () {

  },
})