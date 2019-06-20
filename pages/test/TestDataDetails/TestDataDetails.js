// pages/test/TestDataDetails/TestDataDetails.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["基本信息", "深度"],
    activeIndex: 0
  },

  onLoad: function () {
    var that = this;
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  toTestList:function(){
    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  }
})