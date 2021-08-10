// components/switch/index.js
Component({
  properties: {
    value: {
      type: Boolean,
      value: false
    }
  },

  data: {

  },

  methods: {
    onSwitchItem() {
      let value = this.properties.value
      this.triggerEvent('switchtap', { value }, { bubbles: true, composed: true })
    }
  }
})
