/**
 * Create By Zeffon On 2020/10/16
 */

class HistoryKeyword {
  //1. 不存在实例属性和实例方法，是一个纯静态的类，这样保证数据全局是唯一的。
  // 不会因为你new了一个HistoryKeyword而出现数据差异性

  //2. 单例模式：无论怎么new，在什么地方new，其实都会返回给你同一个类的实例，不会存在多个类的实例。
  // 就是保证在全局只有一个类的实例

  //隐藏设计模式 -- 代理模式

  static MAX_ITEM_COUNT = 20
  static KEY = 'keywords'

  keywords = []

  constructor() {
    //单例模式应用
    if (typeof HistoryKeyword.instance === 'object') {
      return HistoryKeyword.instance
    }

    this.keywords = this._getLocalKeywords()
    HistoryKeyword.instance = this
    return this
  }

  // 缓存中写入数据，最大数量、去重
  save(keyword) {
    const items = this.keywords.filter(k => {
      return k === keyword
    })
    if (items.length !== 0) {
      return
    }
    // 队列
    if (this.keywords.length >= HistoryKeyword.MAX_ITEM_COUNT) {
      this.keywords.pop() // 取出数组最后一个
    }
    this.keywords.unshift(keyword) //放在数组前面
    this._refreshLocal()
  }

  get() {
    return this.keywords
  }

  clear() {
    this.keywords = []
    this._refreshLocal()
  }

  _refreshLocal() {
    wx.setStorageSync(HistoryKeyword.KEY, this.keywords)
  }

  _getLocalKeywords() {
    const keywords = wx.getStorageSync(HistoryKeyword.KEY)
    if (!keywords) {
      wx.setStorageSync(HistoryKeyword.KEY, [])
      return []
    }
    return keywords
  }
}

export {
  HistoryKeyword
}