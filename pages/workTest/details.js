// pages/test/testDetails.js
const App = getApp();
const WXAPI = require('../../utils/main.js');
const until = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wtDetails: null,
    pileList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //初始化页面
    var wtId = options.wtId;
    var that = this;
    that.getEntrustDetails(wtId);
    wx.setStorageSync('wtId', wtId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  //添加检测数据
  toAddRecord: function() {
    var testModeCode = wx.getStorageSync('testModeCode', testModeCode);
    var isTesting = wx.getStorageSync('isTesting');
    
    if (isTesting) { //当前有试验在进行
      until.isTesting();  
    }else{
      var url;
      switch (testModeCode) {
        case 'TQ':
        case 'TZ':
          url = '/pages/ZT/addZTData/addTestData';
          wx.navigateTo({
            url: url
          })
          break;
        case 'ZG':
        case 'ZJ':
        case 'ZY':
          url = '/pages/AddZXTestData/AddZXTestData';
          wx.navigateTo({
            url: url
          })
          break;
      }
    }
  },

  //获取委托单详情信息
  getEntrustDetails: function(wtId) {
    var that = this;  
    wx.showLoading({
      title: '加载中',
    });
    var queryData = {
      'Id': wtId,
    }; 
    WXAPI.GetEntrustDetails(queryData).then(res => {
      wx.hideLoading();
      var resData = res.result;
      that.setData({
        wtDetails: resData,
        testStandard: resData.testStandard,
        pileList: resData.pileList,
        serialNo: resData.serialNo,
        personList: resData.personList,
        equipList: resData.equipList
      });

      //缓存委托单数据
      wx.setStorageSync('serialNo', resData.serialNo);
      wx.setStorageSync('foundationType', resData.foundationType);
      wx.setStorageSync('testModeCode', resData.testModeCode);
    },
    err=>{
      wx.hideLoading();
    });
  }
})