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
    },
    prop: {
      type: String,
      value: 'title'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showSelect: false,
    selectedTitle: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapToggleSelect() {
      console.log(this.data.options);
      if (!this.data.options.length) return;
      this.setData({
        showSelect: !this.data.showSelect
      });
    },
    tapSelect(e) {
      const item = this.data.options[e.target.dataset.index];
      this.setData({
        selectedTitle: item[this.data.prop],
        showSelect: !this.data.showSelect
      });
      this.triggerEvent('change', item);
    }
  }
})
