// pages/test/testData/index.js
const App = getApp();
var until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    serialNo: '',
    pileList: [],
    loadingPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var TestModeCode = wx.getStorageSync('testModeCode');
    this.setData({
      serialNo: options.serialNo,
      TestModeCode: TestModeCode,
    });
    setTimeout(function () {
      that.getPileList(options.serialNo);
    }, 500)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 1000)
    var serialNo = this.data.serialNo;
    this.getPileList(serialNo);
  },
  //获取桩列表
  getPileList: function (serialNo) {
    var that = this;
    var queryData = {
      'SerialNo': serialNo,
      'OrderBy': 4,
      'IsTesting': 0
    }
    var modeType = until.getModeType();
    switch (modeType) {
      case 'PB':
      case 'PT':
      case 'PF':
      case 'PC':
      case 'YJ':
      case 'JM':
      case 'TB':
      case 'ZH':
        modeType = 'JZ'
    }
    WXAPI.GetPileList(queryData, modeType).then(res => {
      that.setData({
        loadingPage: false
      });
      var resData = res.result;
      that.setData({
        pileList: resData
      });
    }, err => {
      that.setData({
        loadingPage: false
      });
    })
  },
  //新增试验数据
  toAddTestData: function () {
    var isTesting = wx.getStorageSync('isTesting');
    var TestModeCode = this.data.TestModeCode;
    if (isTesting) { //当前有试验在进行
      until.isTesting();
    } else {
      var url;
      switch (TestModeCode) {
        case 'TQ':
        case 'TZ':
          url = '/pages/test/addTestData/addTestData';
          break;
        case 'ZG':
        case 'ZJ':
        case 'ZY':
          url = '/pages/AddZXTestData/AddZXTestData';
          break;
      }
      wx.navigateTo({
        url: url
      })
    }
  },
  //查看数据详情
  toTestDataDetails: function (e) {
    var TestModeCode = this.data.TestModeCode;
    var baseInfoId = e.currentTarget.dataset.id;
    var pileId = e.currentTarget.dataset.pileid;
    var url;
    switch (TestModeCode) {
      case 'TQ':
      case 'TZ':
        url = '/pages/ZT/ZTDataDetails/index'
        break;
      case 'ZG':
      case 'ZJ':
      case 'ZY':
        url = '/pages/ZXDetails/index'
        break;
      case 'KY':
      case 'KB':
      case 'SP':
      case 'ZP':
      case 'PB':
      case 'PT':
      case 'PF':
      case 'PC':
      case 'YJ':
      case 'JM':
      case 'TB':
      case 'ZH':
        url = '/pages/WebView/index'
        break;
      case 'DY':
      case 'SC':
        url = '/pages/DCWebView/index';
        break;
    }

    wx.navigateTo({
      url: url + '?baseInfoId=' + baseInfoId + '&pileId=' + pileId + '&TestModeCode=' + TestModeCode + '&type=' + 'testData'
    })
  }
})