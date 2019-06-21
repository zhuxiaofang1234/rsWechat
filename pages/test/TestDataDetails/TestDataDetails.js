// pages/test/TestDataDetails/TestDataDetails.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["基本信息", "深度"],
    activeIndex: 0,
    depthList:[],
    dGrade:''
  },

  onLoad: function(options) {
    var baseInfoId = options.baseInfoId;
    wx.setStorageSync('baseInfoId', baseInfoId);
    this.getTestDatadetails(baseInfoId);
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
            dGrade: resData.dGrade,
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
    var dGrade = this.data.dGrade;
    console.log(dGrade);
    wx.navigateTo({
      url: '/pages/test/addTestData/testRecord?dGrade=' + dGrade
    })
  }
})