// components/group-select/index.js
Component({

  properties: {
    groups: Array
  },

  data: {

  },

  methods: {
    onChangeStatus(event) {
      let index = event.detail.key
      let selectGroup = this.properties.groups[index]
      this.triggerEvent('selecttap', { selectGroup }, { bubbles: true, composed: true })
    },

    onScrollTolower() {
      this.triggerEvent('moretap')
    }
  }
})
