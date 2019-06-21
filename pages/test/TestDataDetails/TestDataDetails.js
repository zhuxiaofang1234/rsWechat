// pages/test/TestDataDetails/TestDataDetails.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["基本信息", "深度"],
    activeIndex: 0,
    baseInfoId:null,
    depthList:[]
  },

  onLoad: function(options) {
    this.setData({
      baseInfoId: options.baseInfoId
    });
    this.getTestDatadetails(options.baseInfoId);
  },
  tabClick: function(e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  //获取指定数据详情
  getTestDatadetails: function (baseInfoId) {
    var that = this;
    var host = App.globalData.host;
    var accessToken = wx.getStorageSync('accessToken');
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
        console.log(res);
        if (res.statusCode == 200) {
          var resData = res.data.result;
          that.setData({
            details: resData,
            depthList: resData.detailsData,

          });
        } else if (res.statusCode == 401) {
          wx.showModal({
            title: '登录过期',
            content: '请重新登录',
            showCancel: false,
            confirmColor: '#4cd964',
            success: function() {
              wx.reLaunch({
                url: '/pages/login/login'
              })
            }
          })
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
  continueTest:function(e){
    wx.navigateTo({
      url: '/pages/test/addTestData/testRecord'
    })
  }
})