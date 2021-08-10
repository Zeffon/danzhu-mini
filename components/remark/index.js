
Component({

  properties: {
    remark: Object,
    isInitValue: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    'remark': function (remark) {
      if (!remark) {
        return
      }
      this.setData({
        _remark: remark
      })
    },

    'isInitValue': function (isInitValue) {
      if(isInitValue) {
        let _remark = this.data._remark
        console.log(_remark)
        let remark = this.properties.remark
        remark.forEach(o => {
          o.value = ""
        })
        this.setData({
          _remark: remark
        })
        this.properties.isInitValue = false
      }
    }
  },
  
  data: {
    _remark: {},
    valueRule: [{
      required: true,
      message: "必填信息不能为空"
    }, {
      type: 'string',
      min: 1,
      max: 20,
      message: "长度在1-20之间"
    }]
  },

  methods: {
    onInput(event) {
      let index = event.target.id
      let newValue = event.detail.value
      let newRemark = this.data._remark
      newRemark[index].value = newValue
      this.triggerEvent('inputtap', {newRemark})
    },

    onClear(event) {
      let index = event.target.id
      let newRemark = this.data._remark
      newRemark[index].value = ""
      this.triggerEvent('inputtap', {newRemark})
    }
  }
})
