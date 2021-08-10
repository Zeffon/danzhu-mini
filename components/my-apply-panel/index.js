import { Group } from "../../models/group";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hasGetData: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    waitingCount: 0,
    passedCount: 0,
    refusedCount: 0
  },

  lifetimes: {
    async attached() {
    }
  },

  pageLifetimes: {
    async show() {
      let hasGetData = this.properties.hasGetData
      if (hasGetData) {
        this.getDataCount()
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotoMyApply(event) {
      const key = event.currentTarget.dataset.key
      wx.navigateTo({
        url: `/pages/my-apply/my-apply?key=${key}`
      })
    },

    async getDataCount() {
      const waitingCount = await Group.getWaitingCount()
      const passedCount = await Group.getPassedCount()
      const refusedCount = await Group.getRefusedCount()
      this.setData({
        waitingCount,
        passedCount,
        refusedCount
      })
    }
  }
})