
Component({

    properties: {
        letters: Array,
        items: Object
    },

    data: {

    },

    methods: {
        // 索引被选中的监听函数
        onSelected(event) {
            console.log(event)
            this.setData({
                indexText: event.detail.indexText
            })
        }
    }
})
