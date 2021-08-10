import { GroupData } from "../../models/group-data"

Component({

  properties: {
    group: Object
  },

  data: {
    _group: Object
  },

  observers: {
    'group': function (group) {
      if (!group) {
        return
      }
      this.setData({
        _group: new GroupData(group),
      })
    }
  },

  methods: {
    
    onEditGroup(event) {
      let gid = event.currentTarget.dataset.gid
      wx.navigateTo({
        url: `/pages/group-edit/group-edit?gid=${gid}`
      })
    },
  }
})
