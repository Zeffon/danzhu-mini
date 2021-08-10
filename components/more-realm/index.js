
Component({

    properties: {
        show: {
            type: Boolean,
            value: false
        },
    },

    data: {

    },

    methods: {
        onCancel() {
            this.triggerEvent('cancel')
        },

        onUploadFile() {
            this.triggerEvent('upload')
        },

        onEditCollect() {
            this.triggerEvent('edit')
        },

        onGetStatistics() {
            this.triggerEvent('get')
        },
        
    }
})
