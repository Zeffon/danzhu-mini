
Component({

    properties: {
        show: {
            type: Boolean,
            value: false
        }
    },

    data: {

    },

    methods: {
        onCancel() {
            this.triggerEvent('cancel')
        },

        onSelectImage() {
            this.triggerEvent('imagetap')
        },

        onSelectFile() {
            this.triggerEvent('filetap')
        },
    }
})
