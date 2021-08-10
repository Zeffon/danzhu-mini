// components/empty/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        text: {
            type: String,
            value: '暂无相关数据'
        },
        btnText: {
            type: String,
            value: '去添加吧'
        },
        show: {
            type: Boolean,
        },
        showBtn: {
            type: Boolean
        }
    },

    data: {},


    attached() {
        this._init()
    },

    methods: {
        _init() {
            wx.lin = wx.lin || {};
            wx.lin.showEmpty = (options) => {
                const {
                    btnText = '去添加吧',
                    text = '暂无相关数据',
                    showBtn = false
                } = { ...options };
                this.setData({
                    btnText,
                    text,
                    showBtn,
                    show: true
                });
            };
            wx.lin.hideEmpty = () => {
                this.setData({
                    show: false
                });
            };
        },

        onTap(event) {
            this.triggerEvent('btntap', {
            }, {
                bubbles: true, // 开启冒泡
                composed: true // 跨越组件的边界
            })
        }
    }
})
