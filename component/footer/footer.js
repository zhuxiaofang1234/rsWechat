// component/footer/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnText:{
      type:String,
      value:'返回'
    }
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
    toLastPage:function(){
      //返回上一页
      wx.navigateBack({
        delta: 1
      }) 
    }
  }
})
