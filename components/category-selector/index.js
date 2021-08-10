// components/category-selector/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    categorys: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickCategory(event) {
      let category = event.currentTarget.dataset.category
      this.triggerEvent('categorytap', {
        category: category
      }, {
        bubbles: true, // 开启冒泡
        composed: true // 跨越组件的边界
      })
    }
  }
})
