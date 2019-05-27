// pages/test/testStandard/testStandard.js
Page({
  data:{
    btnText:'返回'
  },

// //返回委托单详情
  toWtDetails: function () { 
    wx.navigateBack({
      delta: 1
    })
  }
})