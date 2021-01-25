// pages/WebView/index.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var baseInfoId = options.baseInfoId;
    var type = options.type;
    var host = wx.getStorageSync('rshostName');
    var token = wx.getStorageSync('rsAccessToken');
    var windowWidth = App.globalData.windowWidth;
   
    //获取系统信息
    if (host && baseInfoId) {
      this.setData({
        url: ' https://www.whjiace.com/_oa_app/h5app/index.html?baseInfoId=' + baseInfoId + '&host=' + host + '&token=' + token + '&width=' + windowWidth + '&type=' + type
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})