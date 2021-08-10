import {showToast} from "../../utils/ui"

Component({

  properties: {
    value: String,
    text: {
      type: String,
      value: '复制'
    },
    color: {
      type: String,
      value: '#09AAFF'
    },
    btn: {
      type: Boolean,
      value: true
    }
  },

  data: {

  },

  methods: {
    onCopyValue() {
      let code = this.properties.value
      wx.setClipboardData({
        data: code,
        success(res) {
          showToast('success', '复制成功')
        }
      })
    }
  }
})
