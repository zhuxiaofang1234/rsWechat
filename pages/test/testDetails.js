// pages/test/testDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
  ,
  //页面跳转
  toPersonInfo:function(){
    wx.navigateTo({
      url: '/pages/test/personInfo/personInfo'
    });
  },

  toTestStandard: function () {
    wx.navigateTo({
      url: '/pages/test/testStandard/testStandard'
    });
  },

  toReportRes:function(){
    wx.navigateTo({
      url: '/pages/test/reportRes/reportRes'
    });
  },
  toTestList:function(){
    wx.navigateTo({
      url: '/pages/test/testList/testList'
    });
  }
})