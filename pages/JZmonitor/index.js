// pages/test/test.js
const App = getApp();
const WXAPI = require('../../utils/main.js');
var sliderWidth = 36; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accessToken: '',
    totalCount: 0,
    MaxResultCount: 10,
    page: 0,
    testList: [],
    loadingData: true,
    loadingText: '加载中.....',
    loadingPage: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化页面
    var accessToken = wx.getStorageSync('rsAccessToken');
    var that = this;
    if (accessToken) {
      this.setData({
        loadingPage: false
      });
      setTimeout(function () {
        that.getPage();
      }, 600)

      this.setData({
        "accessToken": accessToken
      })
    } else {
      App.redirectToLogin();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 1000)
    if (this.data.accessToken) {
      this.getPage();
    }
  },

  //加载更多
  loadMore: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面上拉触底');
  },

  //获取列表数据
  getPage: function () {
    var that = this;
    var TestModeCode = 'JZ';
    var queryData = {
      'TestModeCode': TestModeCode,
    };
    WXAPI.JZMonitorList(queryData).then(res => {
     
      var resData = res.result;
      that.setData({
        "testList": resData.jzTestData,
      });
      that.setData({
        loadingPage: true
      });
    }, err => {
      that.setData({
        loadingPage: true
      });
    });
  },
  //静载数据详情
  toJZMonitorDetails: function (e) {
    if(!this.data.accessToken){
      App.redirectToLogin();
      return;
    }
    var id = e.currentTarget.dataset.id;
    if(id){
      wx.navigateTo({
        //去根目录下找pages
        url: '/pages/WebView/index?baseInfoId=' + id
      })
    } 
  }
})