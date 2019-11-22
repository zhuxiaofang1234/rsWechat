// pages/test/testDetails.js
const App = getApp();
const WXAPI = require('../../utils/main.js')

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

  //人员信息
  toPersonInfo: function() {
    var personList = JSON.stringify(this.data.personList);
    var equipList = JSON.stringify(this.data.equipList);
    wx.navigateTo({
      url: '/pages/test/personInfo/personInfo?personList=' + personList + '&equipList=' + equipList
    });
  },

//检测依据
  toTestStandard: function() {
    var testStandard = this.data.testStandard;
    wx.navigateTo({
      url: '/pages/test/testStandard/testStandard?testStandard=' + testStandard
    });
  },

  //检测数据
  toTestData: function() {
    var serialNo = this.data.serialNo;
    wx.navigateTo({
      url: '/pages/test/testData/index?serialNo=' + serialNo
    });
  },
  //检测列表
  toTestList: function() {
    wx.navigateTo({
      url: '/pages/test/testList/testList'
    });
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
      wx.setStorageSync('pileList', resData.pileList);
      wx.setStorageSync('serialNo', resData.serialNo);
      wx.setStorageSync('foundationType', resData.foundationType);
      wx.setStorageSync('testModeCode', resData.testModeCode);
    },
    err=>{
      wx.hideLoading();
    });
  },
})