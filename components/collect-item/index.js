// components/collect/index.js
Component({

  properties: {
    item: Object,
    isChecked: {
      type: Boolean,
      value: false
    }
  },

  data: {

  },

  methods: {

    onDetail() {
      let cid = this.properties.item.id
      this.triggerEvent('detail', { cid })
    },

    onAgainShare() {
      let cid = this.properties.item.id
      wx.navigateTo({
        url: `/pages/collect-share/collect-share?cid=${cid}`,
      })
    }
  }
})
