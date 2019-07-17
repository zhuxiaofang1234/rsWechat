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
        if (res.statusCode == 200) {
          var resData = res.data.result;
          that.setData({
            details: resData,
            dGrade: resData.dGrade,
            depthList: resData.detailsData,
            recordCount: resData.recordCount

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
  //继续试验
  continueTest:function(e){
    var dGrade = this.data.dGrade;
    var recordCount = this.data.recordCount;
    wx.navigateTo({
      url: '/pages/test/addTestData/testRecord?dGrade=' + dGrade + '&recordCount=' + recordCount
    })
  },
  //结束实验
  endTest: function () {
    var accessToken = wx.getStorageSync('accessToken');
    var host = App.globalData.host;
    var that = this;
    var baseInfoId = wx.getStorageSync('baseInfoId');
    wx.showModal({
      title: '结束试验',
      content: '确定要结束当前试验吗？',
      confirmColor: '#4cd964',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: host + '/api/services/app/ZTData/Finish?BaseInfoId=' + baseInfoId,
            method: "POST",
            header: {
              'content-type': 'application/json', // 默认值
              'Authorization': "Bearer " + accessToken
            },
            success(res) {
              if (res.statusCode == 200) {
                var serialNo = wx.getStorageSync('serialNo');
                wx.redirectTo({
                  url: '/pages/test/testData/index?serialNo=' + serialNo
                })
              } else {
                wx.showModal({
                  title: '操作失败',
                  content: '当前状态已锁定',
                  showCancel: false,
                  confirmColor: '#4cd964'
                })
              }
            },
            fali() {
              console.log('接口调用失败');
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})