// pages/test/testDetails.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wtDetails: null,
    pileList:[]
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

  //页面跳转
  toPersonInfo: function() {
    wx.navigateTo({
      url: '/pages/test/personInfo/personInfo'
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
    //var pileList = JSON.stringify(this.data.pileList);
    //保留当前页
    wx.navigateTo({
      url: '/pages/test/testList/testList'
    });
  },
  //获取委托单详情信息
  getEntrustDetails: function(wtId) {
    var that = this;
    var host = App.globalData.host;
    var accessToken = wx.getStorageSync('accessToken');
    var url = host + '/api/services/app/WorkRecord/GetEntrustInfoById?Id=' + wtId;
    
    wx.showLoading({
      title: '加载中',
    });

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
          wx.hideLoading();
          var resData = res.data.result;
          that.setData({
            wtDetails: resData,
            testStandard: resData.testStandard,
            pileList: resData.pileList,
            serialNo: resData.serialNo
          });
          //缓存桩列表
          wx.setStorageSync('pileList', resData.pileList);
          wx.setStorageSync('serialNo', resData.serialNo);

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
  }
})