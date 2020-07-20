// pages/test/testDetails.js
const App = getApp();
const WXAPI = require('../../utils/main.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["委托基本信息", "测点列表"],
    activeIndex: 0,
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

  tabClick: function (e) {
    var curIndex = e.currentTarget.id;
    this.setData({
      activeIndex: curIndex
    });
  },

  //检测数据
  toTestData: function() {
    var serialNo = this.data.serialNo;
    wx.navigateTo({
      url: '/pages/test/testData/index?serialNo=' + serialNo
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
      wx.setStorageSync('serialNo', resData.serialNo);
      wx.setStorageSync('foundationType', resData.foundationType);
      wx.setStorageSync('testModeCode', resData.testModeCode);
    },
    err=>{
      wx.hideLoading();
    });
  },

  //编辑测点信息
  toEditTestPoint:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/workRecord/EditTestList?id=' + id
    })
  }
})