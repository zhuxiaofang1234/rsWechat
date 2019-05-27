// pages/test/reportRes/reportRes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnText:'返回'
  },
  toWtDetails: function () {
    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  }
})