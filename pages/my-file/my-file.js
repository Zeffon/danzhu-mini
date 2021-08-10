import { File } from "../../models/file";

Page({

    data: {
        letterFiles: Object,
        monthFiles: Object,
        letters: Array,
        months: Array,
        isLetter: true
    },

    onLoad: function (options) {
        wx.lin.showLoading({
            color: '#09AAFF',
            type: 'flash',
            fullScreen: true
          })
        this._initData()
        wx.lin.hideLoading()
    },

    onSelectMonth() {
        this.setData({
            isLetter: false
        })
    },

    onSelectLetter() {
        this.setData({
            isLetter: true
        })
    },
    
    async _initData() {
        let that = this
        that._initLetterData()
        that._initMonthData()
    },

    async _initMonthData(){
        let that = this
        let items = await File.listMonthFile()
        let months = new Array()
        for(let month in items) {
            months.unshift(month)
        }
        that.setData({
            months,
            monthFiles: items
        })
    },

    async _initLetterData(){
        let that = this
        let items = await File.listLetterFile()
        let letters = new Array()
        for(let letter in items) {
            letters.push(letter)
        }
        that.setData({
            letters,
            letterFiles: items
        })
    }
})