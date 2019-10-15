// select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    options: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showSelect: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapShowSelect() {
      this.setData({
        showSelect: true
      })
    }
  }
})
