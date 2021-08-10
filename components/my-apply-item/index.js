import { getLineYMDHM } from "../../utils/date";

Component({

  properties: {
    item: Object,
  },

  observers: {
    'item': function (item) {
      if (!item) {
        return
      }
      let create_time = getLineYMDHM(item.create_time)
      this.setData({
        create_time
      })
    }
  },

  data: {

  },

  methods: {

  }
})
