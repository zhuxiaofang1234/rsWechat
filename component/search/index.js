// component/search/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inputShowed: { // 属性名
      type: Boolean,
      value: false
    },
    searchText: {
      type: String,
      value: '检测编号'
    },
    cancelText:{
      type: String,
      value: '取消'
    },
    selectedTestMode: {
      type: String,
      value: '高应变'
    },
    isSelectedTestMode:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputVal: "",

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //选择检测方法
    toSelectTestMode: function () {
      this.triggerEvent('SelectTestMode',{}) 
    },
    //显示搜索框
    showInput: function (e) {
      this.setData({
        inputShowed: true
      })
    },

    //获取输入的值
    inputTyping: function (e) {
      this.setData({
        inputVal: e.detail.value
      });
      this.triggerEvent('getInputValue', e.detail.value)
    },
    //隐藏输入框
    hideInput: function () {
      this.setData({
        inputShowed: false,
        inputVal:""
      });
      this.triggerEvent('cancelSearch',{})   
    },

    clearInput: function () {
      console.log(334344)
      this.setData({
        inputVal: ""
      })
    },
    search:function(){
      this.triggerEvent('getSearchResult',this.data.inputVal)   
    }
  }
})