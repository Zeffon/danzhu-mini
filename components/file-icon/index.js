
Component({

    properties: {
        title: String
    },

    observers: {
        'title': function (title) {
            if (!title) {
                return
            }
            let i = title.lastIndexOf(".")
            let ext = title.substr(i + 1).toUpperCase()
            this.setData({        
                ext
            })
        }
    },

    data: {

    },

    methods: {

    }
})
