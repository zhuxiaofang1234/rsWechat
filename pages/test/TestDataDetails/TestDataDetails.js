// pages/test/TestDataDetails/TestDataDetails.js
const App = getApp();
const until = require('../../../utils/util.js');
const WXAPI = require('../../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["基本信息", "深度"],
    activeIndex: 0,
    depthList: [],
    baseInfoId:null,
    dGrade: '',
    depthHeight: 470,
    isTesting: 0
  },

  onLoad: function(options) {
    var baseInfoId = options.baseInfoId;
    
    var pileId = options.pileId;
    this.setData({
      baseInfoId: baseInfoId,
    });
    wx.setStorageSync('pileId', pileId);
   this.getTestDatadetails(baseInfoId);
  },

  tabClick: function(e) {
    var that = this;
    var curIndex = e.currentTarget.id;
    this.setData({
      activeIndex: curIndex
    });
    //获取测试情况
    var isTesting = this.data.isTesting;
    if (curIndex == 1) {
      //获取tab的高度
      var h = App.globalData.windowHeight;
      if (isTesting == 1) {
        that.setData({
          depthHeight: h-136
        });
      } else {
        that.setData({
          depthHeight: h - 20
        });
      }
    }
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 1000)
    this.getTestDatadetails(this.data.baseInfoId);
  },

  //获取指定数据详情
  getTestDatadetails: function(baseInfoId) {
    var that = this;
    var queryData= {
      'BaseInfoId': baseInfoId
    }
    wx.showLoading({
      title: '加载中',
    });

    WXAPI.GetZTDatadetails(queryData).then(res=>{
      var resData = res.result;
      wx.hideLoading();
      that.setData({
        details: resData,
        dGrade: resData.dGrade,
        depthList: resData.detailsData,
        recordCount: resData.recordCount,
        isTesting: resData.isTesting
      });
      //缓存实验基本信息
      wx.setStorageSync('ZTBaseData', resData);

    //缓存实验深度
      wx.setStorageSync('depthList',resData.detailsData);
    })  
  },
  toTestList: function() {
    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  },
  //继续试验
  continueTest: function(e) {
    //判断上一次试验的缓存是否还在
    var resData = this.data.details;
    var BaseTestData = wx.getStorageSync('BaseTestData');
   
    if (!BaseTestData){
      var createBaseData = {};
      createBaseData.baseInfoId = resData.baseInfoId;
      createBaseData.dGrade = resData.dGrade;
      createBaseData.machineId = resData.machineId;
      createBaseData.pileNo = resData.pileNo;
      createBaseData.serialNo = resData.serialNo;
      createBaseData.foundationType = resData.foundationType;
      createBaseData.pileNo = resData.pileNo;

      var createLastTestRecord = {};
      var len = resData.detailsData.length;
      createLastTestRecord = resData.detailsData[len - 1];

      wx.setStorageSync('BaseTestData', createBaseData);
      wx.setStorageSync('lastDepthData', createLastTestRecord);
    }
    wx.navigateTo({
      url: '/pages/test/addTestData/testRecord' 
    })
  }, 
  //结束实验
  endTest: function() {
    until.endTest()
  },
  //编辑实验基本信息
  toEditTestData:function(e){
    wx.navigateTo({
      url:'/pages/test/editTestData/editTestData'
    });
  },
  //编辑实验深度
  toEditZTDepth:function(e){
    var Id = e.currentTarget.dataset.id;
    var baseInfoId = this.data.baseInfoId;
    wx.navigateTo({
      url: '/pages/test/EditZTdepth/EditZTdepth?Id=' + Id + '&baseInfoId=' + baseInfoId,
    })
  }

})