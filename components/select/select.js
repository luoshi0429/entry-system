// select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideList: {
      type: Boolean,
      value: false,
      observer(val) {
        this.setData({
          showSelect: !val
        });
      }
    },
    setDisabled: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    options: {
      type: Array,
      value: [],
      observer() {
        this.setData({
          selectedTitle: ''
        })
      }
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
      if (!this.data.options.length) return;
      // this.setData({
      //   showSelect: !this.data.showSelect
      // });
      this.triggerEvent('expand', !this.data.showSelect);
    },
    tapSelect(e) {
      const item = this.data.options[e.target.dataset.index];
      this.setData({
        selectedTitle: item[this.data.prop],
        // showSelect: !this.data.showSelect
      });
      this.triggerEvent('change', item);
      this.triggerEvent('expand', !this.data.showSelect);
    }
  }
})
