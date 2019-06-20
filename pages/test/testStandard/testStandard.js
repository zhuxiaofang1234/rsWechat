// pages/test/testStandard/testStandard.js
Page({
  data:{
    btnText:'返回',
    testStandard:[]
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var testStandard = options.testStandard;
    if (testStandard){
      testStandard = testStandard.split(',');
      this.setData({
        testStandard: testStandard
      });
    }
  },

 //返回委托单详情
  toWtDetails: function () { 
    wx.navigateBack({
      delta: 1
    })
  }
})