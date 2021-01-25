// component/popup/index.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['i-class', 'i-class-mask', 'i-class-header'],
  options: {
    multipleSlots: true
  },
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    maskClosable: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: "标题"
    },
    cancelText: {
      type: String,
      value: '确定'
    },
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
    handleClickMask() {
      if (!this.data.maskClosable) return;
      this.setData({
        visible:false
       })
    },

    handleClickCancel() {
     this.setData({
      visible:false
     })
    },
    handleSure(){
      this.triggerEvent('sure')
    }
  }
})