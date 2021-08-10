import { linShowToast } from "../../utils/ui";

Component({

  properties: {
    count: {
      type: Number,
      value: 3
    },
    min: {
      type: Number,
      value: 1
    },
    max: {
      type: Number,
      value: 7
    }
  },

  observers: {
    'count,min,max': function (count, min, max) {
      // console.log(count, min, max)
    },
  },

  data: {

  },

  methods: {
    onOverStep(event) {
      const minOrMaxOut = event.detail.type
      if (minOrMaxOut == 'overflow_max') {
        linShowToast('error', '超出最大限制数量')
      }
      if (minOrMaxOut == 'overflow_min') {
        linShowToast('error', `最少需要选择 1 天`)
      }
    }
  }
})
