// pages/testDatas/webView.js
const App = getApp();
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
    console.log(options)
    var baseInfoId = options.baseInfoId;
    var host = wx.getStorageSync('rshostName');
    var token = wx.getStorageSync('rsAccessToken');
    var windowWidth = App.globalData.windowWidth;
    var urlSection, title;
    switch (options.TestModeCode) {
      case 'JZ':
        title = '静载数据详情';
        break;
      case 'DY':
        title = '低应变数据详情';
        urlSection = '/h5App/DYData/index.html';
        break;
      case 'GY':
        title = '高应变数据详情';
        break;
      case 'SC':
        title = '声波透射数据详情';
        urlSection = '/h5App/SCData/index.html';
        break;
      case 'ZX':
        title = '钻芯数据详情';
        break;
    }
    wx.setNavigationBarTitle({
      title: title,
    });
    //获取系统信息
    if (host && baseInfoId) {
      var url = host + urlSection + '?baseInfoId=' + encodeURIComponent(baseInfoId) + '&host=' + encodeURIComponent(host) + '&token=' + encodeURIComponent(token) + '&width=' + encodeURIComponent(windowWidth);
      this.setData({
        url: url
      });
    }
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