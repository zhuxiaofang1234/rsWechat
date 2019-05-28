// pages/test/TestDataDetails/TestDataDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectArray: [
      {
        "id": "0",
        "text": "0.3"
      },
      {
        "id": "1",
        "text": "0.6"
      }, {
        "id": "2",
        "text": "0.9"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  toTestList:function(){
    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  }
})