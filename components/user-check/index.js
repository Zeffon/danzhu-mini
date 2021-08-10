
Component({

  properties: {
    users: Array
  },

  data: {

  },

  methods: {
    onChange(event) {
      let users = this.properties.users
      users.forEach(item => {
        if (item.id + "" === event.detail.key) {
          item.checked = event.detail.checked;
        }
      });
      this.triggerEvent('choosetap', { users }, { bubbles: true, composed: true })
    }
  }
})
