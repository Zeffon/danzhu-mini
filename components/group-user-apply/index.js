
Component({

  properties: {
    user: Object
  },

  data: {
    showActionSheet: false,
    itemList: [{
      name: '通过',
      icon: 'success',
      iconSize: '30',
      color: '#34bfa3'
    },
    {
      name: '拒绝',
      icon: 'error',
      iconSize: '30',
      color: '#F4516C'
    }]
  },

  methods: {

    onShowActionSheet(event) {
      let id = event.currentTarget.dataset.id
      this.setData({
        showActionSheet: true
      })
    },

    onChooseStatus(event) {
      let status = event.detail.index + 1 // 由于action-sheet的列表是从0开始算的
      let id = this.properties.user.id

      this.triggerEvent('choosetap', { id, status }, { bubbles: true, composed: true })
    },

  }
})
