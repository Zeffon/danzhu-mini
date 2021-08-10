// components/counter2/index.js
Component({

  properties: {
    value: Number,
    range: Array
  },

  data: {

  },

  methods: {
    onPickerChange(event) {
      let rangeIndex = event.detail.value;
      let value = this.properties.range[rangeIndex]
      this.triggerEvent('changetap', { value }, { bubbles: true, composed: true })
    }
  }
})
