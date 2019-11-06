// pages/test/TestDataDetails/TestDataDetails.js
const App = getApp();
var until = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["基本信息", "深度"],
    activeIndex: 0,
    depthList: [],
    dGrade: '',
    depthHeight: null,
    isTesting: 0
  },

  onLoad: function(options) {
    var baseInfoId = options.baseInfoId;
    wx.setStorageSync('baseInfoId', baseInfoId);
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
          depthHeight: h-106
        });
      } else {
        that.setData({
          depthHeight: h - 20
        });
      }
    }
  },
  //获取指定数据详情
  getTestDatadetails: function(baseInfoId) {
    var that = this;
    var host = App.globalData.host;
    var accessToken = App.globalData.accessToken;
    var url = host + '/api/services/app/ZTData/GetById?BaseInfoId=' + baseInfoId;
    wx.request({
      url: url,
      method: "GET",
      dataType: "json",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': "Bearer " + accessToken
      },
      success(res) {
        if (res.statusCode == 200) {
          var resData = res.data.result;
          that.setData({
            details: resData,
            dGrade: resData.dGrade,
            depthList: resData.detailsData,
            recordCount: resData.recordCount,
            isTesting: resData.isTesting
          });
        } else if (res.statusCode == 401) {
            App.redirectToLogin();
        }
      }
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
    var dGrade = this.data.dGrade;
    var recordCount = this.data.recordCount;
    //获取最后一条试验的深度
    var depthList = this.data.depthList;
    var len = depthList.length; 
    if (len!=0){
      var lastDepth = JSON.stringify(depthList[len - 1]);
      console.log(lastDepth);
    }
    wx.navigateTo({
      url: '/pages/test/addTestData/testRecord' 
    })
  }, 
  //结束实验
  endTest: function() {
    until.endTest()
  }
})